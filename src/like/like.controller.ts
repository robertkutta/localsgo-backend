import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { Like } from '@prisma/client';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post('toggle')
  toggleLike(
    @Body() createLikeDto: CreateLikeDto,
  ): Promise<{ liked: boolean; likeCount: number }> {
    return this.likeService.toggleLike(createLikeDto);
  }

  @Get('itinerary/:itineraryId')
  findByItineraryId(
    @Param('itineraryId', ParseIntPipe) itineraryId: number,
  ): Promise<Like[]> {
    return this.likeService.findByItineraryId(itineraryId);
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string): Promise<Like[]> {
    return this.likeService.findByUserId(userId);
  }
}
