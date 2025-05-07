import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { SpotModule } from './spot/spot.module';
import { ReviewModule } from './review/review.module';
import { LikeModule } from './like/like.module';
import { SaveModule } from './save/save.module';
import { ReportModule } from './report/report.module';
import { AuthModule } from './auth/auth.module';
import { ClerkAuthMiddleware } from './auth/auth.middleware';
import { ItineraryModule } from './itinerary/itinerary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    ItineraryModule,
    SpotModule,
    ReviewModule,
    LikeModule,
    SaveModule,
    ReportModule,
    AuthModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Clerk auth middleware to all routes except health check
    consumer.apply(ClerkAuthMiddleware).exclude('api/health').forRoutes('*');
  }
}
