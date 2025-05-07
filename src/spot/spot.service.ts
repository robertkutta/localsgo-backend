import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Spot } from '@prisma/client';
import { CreateSpotDto } from './dto/create-spot.dto';
import { UpdateSpotDto } from './dto/update-spot.dto';
import { Logger } from '@nestjs/common';

@Injectable()
export class SpotService {
  private readonly logger = new Logger(SpotService.name);

  constructor(private prisma: PrismaService) {}

  private async updateDerivedCategories(itineraryId: number): Promise<void> {
    try {
      const spots = await this.prisma.spot.findMany({
        where: { itineraryId },
      });

      const categories = spots
        .map((spot) => spot.category)
        .filter(
          (category): category is string =>
            category !== null && category !== undefined,
        );

      const uniqueCategories = [...new Set(categories)];

      await this.prisma.itinerary.update({
        where: { id: itineraryId },
        data: {
          derivedCategories: uniqueCategories,
        },
      });

      this.logger.log(
        `Updated derivedCategories for itinerary ${itineraryId}: ${uniqueCategories.join(', ')}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to update derived categories for itinerary ${itineraryId}:`,
        error,
      );
    }
  }

  async create(createSpotDto: CreateSpotDto): Promise<Spot> {
    const result = await this.prisma.spot.create({
      data: createSpotDto,
    });

    // Update derived categories on the parent itinerary
    await this.updateDerivedCategories(createSpotDto.itineraryId);

    return result;
  }

  async findOne(id: number): Promise<Spot> {
    const spot = await this.prisma.spot.findUnique({
      where: { id },
    });

    if (!spot) {
      throw new NotFoundException(`Spot with ID ${id} not found`);
    }

    return spot;
  }

  async findByItineraryId(itineraryId: number): Promise<Spot[]> {
    const spots = await this.prisma.spot.findMany({
      where: { itineraryId },
      orderBy: { id: 'asc' },
    });

    return spots.map((spot, index) => ({
      ...spot,
      index: index + 1,
    }));
  }
  async createManyForItinerary(
    itineraryId: number,
    spotDtos: CreateSpotDto[],
  ): Promise<Spot[]> {
    const spotsWithItineraryId = spotDtos.map((spotDto) => ({
      ...spotDto,
      itineraryId,
    }));

    const createdSpots = await this.prisma.$transaction(
      spotsWithItineraryId.map((spotData) =>
        this.prisma.spot.create({ data: spotData }),
      ),
    );

    await this.updateDerivedCategories(itineraryId);

    return createdSpots;
  }

  async update(id: number, updateSpotDto: UpdateSpotDto): Promise<Spot> {
    try {
      const currentSpot = await this.prisma.spot.findUnique({
        where: { id },
      });

      if (!currentSpot) {
        throw new NotFoundException(`Spot with ID ${id} not found`);
      }

      const updatedSpot = await this.prisma.spot.update({
        where: { id },
        data: updateSpotDto,
      });

      await this.updateDerivedCategories(currentSpot.itineraryId);

      return updatedSpot;
    } catch (error) {
      this.logger.error(`Error updating spot with ID ${id}:`, error);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const spot = await this.prisma.spot.findUnique({
      where: { id },
    });

    if (!spot) {
      throw new NotFoundException(`Spot with ID ${id} not found`);
    }

    const itineraryId = spot.itineraryId;

    await this.prisma.spot.delete({
      where: { id },
    });

    await this.updateDerivedCategories(itineraryId);
  }

  async getAllCategories(): Promise<string[]> {
    const spots = await this.prisma.spot.findMany({
      where: {
        category: {
          not: null,
        },
      },
      select: {
        category: true,
      },
    });

    const categories = spots
      .map((spot) => spot.category)
      .filter((category): category is string => category !== null);

    return [...new Set(categories)];
  }
}
