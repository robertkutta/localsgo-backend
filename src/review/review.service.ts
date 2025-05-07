import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Review } from '@prisma/client';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    try {
      return await this.prisma.review.create({
        data: createReviewDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(`User already reviewed this itinerary`);
      }
      throw error;
    }
  }

  async findByItineraryId(itineraryId: number): Promise<Review[]> {
    return this.prisma.review.findMany({
      where: { itineraryId },
    });
  }

  async findByUserId(userId: string): Promise<Review[]> {
    return this.prisma.review.findMany({
      where: { userId },
    });
  }

  async findUserReviews(userId: string): Promise<Review[]> {
    const userItineraries = await this.prisma.itinerary.findMany({
      where: { userId },
      select: { id: true },
    });

    if (userItineraries.length === 0) {
      return [];
    }

    const reviews = await this.prisma.review.findMany({
      where: {
        itineraryId: {
          in: userItineraries.map((itinerary) => itinerary.id),
        },
      },
      include: {
        itinerary: {
          select: {
            name: true,
            description: true,
          },
        },
      },
    });
    return reviews;
  }

  async getAverageRatingByItineraryId(
    itineraryId: number,
  ): Promise<number | null> {
    const reviews = await this.prisma.review.findMany({
      where: { itineraryId },
      select: { rating: true },
    });

    if (reviews.length === 0) {
      return null;
    }

    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    return averageRating;
  }

  async remove(id: number): Promise<void> {
    try {
      await this.prisma.review.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Review with ID ${id} not found`);
      }
      throw error;
    }
  }
}
