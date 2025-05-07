import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from '@prisma/client';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  create(@Body() createReviewDto: CreateReviewDto): Promise<Review> {
    return this.reviewService.create(createReviewDto);
  }

  @Get('my-itineraries/:userId')
  async findUserReviews(@Param('userId') userId: string): Promise<Review[]> {
    return this.reviewService.findUserReviews(userId);
  }

  @Get('itinerary/:itineraryId')
  findByItineraryId(
    @Param('itineraryId', ParseIntPipe) itineraryId: number,
  ): Promise<Review[]> {
    return this.reviewService.findByItineraryId(itineraryId);
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string): Promise<Review[]> {
    return this.reviewService.findByUserId(userId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.reviewService.remove(id);
  }

  @Get('itinerary/:id/average-rating')
  async getAverageRatingByItineraryId(
    @Param('id', ParseIntPipe) itineraryId: number,
  ) {
    return this.reviewService.getAverageRatingByItineraryId(itineraryId);
  }
}
