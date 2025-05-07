import { Injectable } from '@nestjs/common';
import { Itinerary } from '@prisma/client';
import { DistanceService } from './distance.service';

type SortOption = 'nearest' | 'recent' | 'popular';

interface ExtendedFilterOptions {
  tripTypes?: string[];
  categories?: string[];
  distanceKm?: number;
  sortOption?: SortOption;
  latitude?: number;
  longitude?: number;
}

@Injectable()
export class FilterService {
  constructor(private readonly distanceService: DistanceService) {}

  /**
   * Sort itineraries based on sort option
   */
  sortItineraries(
    itineraries: (Itinerary & { likeCount?: number })[],
    sortOption: SortOption,
    latitude?: number,
    longitude?: number,
  ): void {
    if (sortOption === 'nearest' && latitude && longitude) {
      itineraries.sort((a, b) => {
        if (!a.latitude || !a.longitude) return 1;
        if (!b.latitude || !b.longitude) return -1;

        const distanceA = this.distanceService.calculateDistance(
          latitude,
          longitude,
          a.latitude,
          a.longitude,
        );

        const distanceB = this.distanceService.calculateDistance(
          latitude,
          longitude,
          b.latitude,
          b.longitude,
        );

        return distanceA - distanceB;
      });
    } else if (sortOption === 'recent') {
      itineraries.sort((a, b) => {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return timeB - timeA;
      });
    } else if (sortOption === 'popular') {
      itineraries.sort((a, b) => {
        const likesA = a.likeCount || 0;
        const likesB = b.likeCount || 0;

        if (likesB === likesA) {
          return a.name.localeCompare(b.name);
        }

        return likesB - likesA;
      });
    } else {
      itineraries.sort((a, b) => {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return timeB - timeA;
      });
    }
  }

  /**
   * Build SQL query for filtering itineraries
   */
  buildFilterQuery(options: ExtendedFilterOptions): {
    query: string;
    params: any[];
  } {
    let sqlQuery = `
      SELECT * FROM "Itinerary"
      WHERE (
        6371 * acos(
          cos(radians($1::numeric)) * cos(radians("latitude"::numeric)) *
          cos(radians("longitude"::numeric) - radians($2::numeric)) +
          sin(radians($1::numeric)) * sin(radians("latitude"::numeric))
        )
      ) < $3::numeric
    `;

    const params: any[] = [
      options.latitude,
      options.longitude,
      options.distanceKm,
    ];

    if (options.tripTypes?.length) {
      sqlQuery += ` AND "tripTypes" && ARRAY[${options.tripTypes
        .map((_, i) => `$${i + 4}::text`)
        .join(',')}]`;
      options.tripTypes.forEach((type) => params.push(type));
    }

    if (options.categories?.length) {
      const categoryParamOffset = params.length + 1;
      sqlQuery += ` AND "derivedCategories" && ARRAY[${options.categories
        .map((_, i) => `$${i + categoryParamOffset}::text`)
        .join(',')}]`;
      options.categories.forEach((category) => params.push(category));
    }

    return { query: sqlQuery, params };
  }
}
