import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Like, Itinerary } from '@prisma/client';
import { CreateLikeDto } from './dto/create-like.dto';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  private async create(createLikeDto: CreateLikeDto): Promise<Like> {
    return await this.prisma.like.create({
      data: createLikeDto,
    });
  }

  private async remove(id: number): Promise<void> {
    await this.prisma.like.delete({
      where: { id },
    });
  }

  async findByItineraryId(itineraryId: number): Promise<Like[]> {
    return this.prisma.like.findMany({
      where: { itineraryId },
    });
  }

  async findByUserId(userId: string): Promise<Like[]> {
    return this.prisma.like.findMany({
      where: { userId },
    });
  }

  private async findByUserAndItinerary(
    userId: string,
    itineraryId: number,
  ): Promise<Like | null> {
    return this.prisma.like.findFirst({
      where: {
        userId,
        itineraryId,
      },
    });
  }

  async toggleLike(
    createLikeDto: CreateLikeDto,
  ): Promise<{ liked: boolean; likeCount: number }> {
    const { userId, itineraryId } = createLikeDto;

    const existingLike = await this.findByUserAndItinerary(userId, itineraryId);

    if (existingLike) {
      await this.remove(existingLike.id);

      const likeCount = await this.prisma.like.count({
        where: { itineraryId },
      });

      return { liked: false, likeCount };
    } else {
      await this.create(createLikeDto);

      const likeCount = await this.prisma.like.count({
        where: { itineraryId },
      });

      return { liked: true, likeCount };
    }
  }

  async addLikeCountsToItineraries(
    itineraries: Itinerary[],
  ): Promise<(Itinerary & { likeCount: number })[]> {
    const likeCounts = await this.prisma.like.groupBy({
      by: ['itineraryId'],
      _count: {
        id: true,
      },
    });

    const likeCountMap = new Map();
    likeCounts.forEach((count) => {
      likeCountMap.set(count.itineraryId, count._count.id);
    });

    return itineraries.map((itinerary) => ({
      ...itinerary,
      likeCount: likeCountMap.get(itinerary.id) || 0,
    }));
  }

  async getLikeCount(itineraryId: number): Promise<number> {
    return await this.prisma.like.count({
      where: { itineraryId },
    });
  }
}
