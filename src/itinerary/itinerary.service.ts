import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { UpdateItineraryDto } from './dto/update-itinerary.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Itinerary, Spot } from '@prisma/client';
import { Logger } from '@nestjs/common';
import { DistanceService } from './services/distance.service';
import { FilterService } from './services/filter.service';
import { LikeService } from '../like/like.service';

@Injectable()
export class ItineraryService {
  private readonly logger = new Logger(ItineraryService.name);

  constructor(
    private prisma: PrismaService,
    private distanceService: DistanceService,
    private filterService: FilterService,
    private likeService: LikeService,
  ) {}

  private extractUniqueCategories(
    spots: { category?: string | null }[],
  ): string[] {
    const categories = spots
      .map((spot) => spot.category)
      .filter(
        (category): category is string =>
          category !== null && category !== undefined,
      );

    return [...new Set(categories)];
  }

  async create(createItineraryDto: CreateItineraryDto) {
    try {
      this.logger.log(
        `Creating itinerary ${JSON.stringify(createItineraryDto)}`,
      );

      const spots = createItineraryDto.spots
        ? createItineraryDto.spots.map((spot) => ({
            name: spot.name,
            description: spot.description,
            latitude: spot.latitude,
            longitude: spot.longitude,
            placeId: spot.placeId,
            address: spot.address,
            price: spot.price,
            category: spot.category,
            updatedAt: new Date(),
          }))
        : [];

      const uniqueCategories = this.extractUniqueCategories(spots);

      if (spots.length > 0) {
        const result = await this.prisma.itinerary.create({
          data: {
            userId: createItineraryDto.userId || 'anonymous',
            name: createItineraryDto.name,
            description: createItineraryDto.description,
            latitude: createItineraryDto.latitude,
            longitude: createItineraryDto.longitude,
            tripTypes: createItineraryDto.tripTypes || [],
            derivedCategories: uniqueCategories,
            spots: {
              create: spots,
            },
          },
          include: {
            spots: true,
          },
        });

        return result;
      }

      const result = await this.prisma.itinerary.create({
        data: {
          userId: createItineraryDto.userId || 'anonymous',
          name: createItineraryDto.name,
          description: createItineraryDto.description,
          latitude: createItineraryDto.latitude,
          longitude: createItineraryDto.longitude,
          tripTypes: createItineraryDto.tripTypes || [],
          derivedCategories: [],
        },
      });

      return result;
    } catch (error) {
      this.logger.error('Error creating itinerary in service:', error);
      throw error;
    }
  }

  async findAll() {
    try {
      this.logger.log('Fetching all itineraries');
      const itineraries = await this.prisma.itinerary.findMany({
        include: {
          spots: true,
        },
      });

      this.logger.log(`Found ${itineraries.length} itineraries`);

      if (!itineraries || itineraries.length === 0) {
        this.logger.warn('No itineraries found in database');
        return [];
      }

      this.logger.log('Adding like counts to itineraries');
      const result = await this.likeService.addLikeCountsToItineraries(
        itineraries as Itinerary[],
      );

      this.logger.log(`Returning ${result.length} itineraries with likes`);
      return result;
    } catch (error) {
      this.logger.error('Error fetching itineraries:', error);
      throw error;
    }
  }

  async findOne(id: number) {
    const itinerary = await this.prisma.itinerary.findUnique({
      where: { id },
      include: {
        spots: true,
      },
    });

    if (!itinerary) {
      throw new NotFoundException(`Itinerary with ID ${id} not found`);
    }

    const likeCount = await this.likeService.getLikeCount(id);

    return {
      ...itinerary,
      likeCount,
    };
  }

  async update(
    id: number,
    updateItineraryDto: UpdateItineraryDto,
    userId?: string,
  ) {
    if (userId) {
      const itinerary = await this.prisma.itinerary.findUnique({
        where: { id },
      });

      if (!itinerary) {
        throw new NotFoundException(`Itinerary with ID ${id} not found`);
      }

      if (itinerary.userId !== userId) {
        throw new ForbiddenException(
          'You do not have permission to update this itinerary',
        );
      }
    }

    const updated = await this.prisma.itinerary.update({
      where: { id },
      data: updateItineraryDto,
      include: {
        spots: true,
      },
    });

    return updated;
  }

  async remove(id: number, userId?: string) {
    if (userId) {
      const itinerary = await this.prisma.itinerary.findUnique({
        where: { id },
      });

      if (!itinerary) {
        throw new NotFoundException(`Itinerary with ID ${id} not found`);
      }

      if (itinerary.userId !== userId) {
        throw new ForbiddenException(
          'You do not have permission to delete this itinerary',
        );
      }
    }

    await this.prisma.itinerary.delete({
      where: { id },
    });
  }

  async getItinerariesNear(
    latitude: number,
    longitude: number,
    radiusInKm: number,
  ) {
    const itineraries = await this.distanceService.getItinerariesNear(
      this.prisma,
      latitude,
      longitude,
      radiusInKm,
    );

    const itinerariesWithSpots = await Promise.all(
      itineraries.map(async (itinerary) => {
        const spots = await this.prisma.spot.findMany({
          where: { itineraryId: itinerary.id },
        });

        return {
          ...itinerary,
          spots,
        };
      }),
    );

    return itinerariesWithSpots;
  }

  async filterAndSort(options: {
    tripTypes?: string[];
    categories?: string[];
    distanceKm?: number;
    sortOption?: 'nearest' | 'recent' | 'popular';
    latitude?: number;
    longitude?: number;
  }) {
    this.logger.log(`Filtering with options: ${JSON.stringify(options)}`);

    let itineraries;

    // Use distance-based geographical query if distance filter is provided
    if (options.distanceKm && options.latitude && options.longitude) {
      const { query, params } = this.filterService.buildFilterQuery(options);
      itineraries = await this.prisma.$queryRawUnsafe(query, ...params);

      itineraries = await Promise.all(
        itineraries.map(async (itinerary) => {
          const spots = await this.prisma.spot.findMany({
            where: { itineraryId: itinerary.id },
          });

          return {
            ...itinerary,
            spots,
          };
        }),
      );
    } else {
      // Regular querying without distance filter
      const where: any = {};

      if (options.tripTypes?.length) {
        where.tripTypes = {
          hasSome: options.tripTypes,
        };
      }

      if (options.categories?.length) {
        where.derivedCategories = {
          hasSome: options.categories,
        };
      }

      itineraries = await this.prisma.itinerary.findMany({
        where,
        include: {
          spots: true,
        },
      });
    }

    if (options.sortOption === 'popular') {
      itineraries = await this.likeService.addLikeCountsToItineraries(
        itineraries as Itinerary[],
      );
    }

    // Apply sorting based on sort option
    if (options.sortOption) {
      this.filterService.sortItineraries(
        itineraries,
        options.sortOption,
        options.latitude,
        options.longitude,
      );
    }

    return itineraries;
  }
}
