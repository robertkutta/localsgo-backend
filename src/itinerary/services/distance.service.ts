import { Injectable } from '@nestjs/common';
import { Itinerary } from '@prisma/client';

@Injectable()
export class DistanceService {
  /**
   * Calculating distance between two coordinates in kilometers
   */
  calculateDistance(
    latitude1: number,
    longitude1: number,
    latitude2: number,
    longitude2: number,
  ): number {
    const R = 6371; // Radius of the earth in km
    const dLat = ((latitude2 - latitude1) * Math.PI) / 180;
    const dLon = ((longitude2 - longitude1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((latitude1 * Math.PI) / 180) *
        Math.cos((latitude2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  }

  /**
   * Getting itineraries near a specific location
   */
  async getItinerariesNear(
    prisma: any,
    latitude: number,
    longitude: number,
    radiusInKm: number,
  ): Promise<Itinerary[]> {
    return await prisma.$queryRawUnsafe(
      `
        SELECT * FROM "Itinerary"
        WHERE (
          6371 * acos(
            cos(radians($1::numeric)) * cos(radians("latitude"::numeric)) *
            cos(radians("longitude"::numeric) - radians($2::numeric)) +
            sin(radians($1::numeric)) * sin(radians("latitude"::numeric))
          )
        ) < $3::numeric
        ORDER BY (
          6371 * acos(
            cos(radians($1::numeric)) * cos(radians("latitude"::numeric)) *
            cos(radians("longitude"::numeric) - radians($2::numeric)) +
            sin(radians($1::numeric)) * sin(radians("latitude"::numeric))
          )
        ) ASC
      `,
      latitude,
      longitude,
      radiusInKm,
    );
  }
}
