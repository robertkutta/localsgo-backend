import { Module } from '@nestjs/common';
import { ItineraryController } from './itinerary.controller';
import { ItineraryService } from './itinerary.service';
import { PrismaModule } from '../prisma/prisma.module';
import { SpotModule } from '../spot/spot.module';
import { DistanceService } from './services/distance.service';
import { FilterService } from './services/filter.service';
import { LikeModule } from '../like/like.module';

@Module({
  imports: [PrismaModule, SpotModule, LikeModule],
  controllers: [ItineraryController],
  providers: [ItineraryService, DistanceService, FilterService],
  exports: [ItineraryService],
})
export class ItineraryModule {}
