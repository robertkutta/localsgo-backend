import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { SpotService } from './spot.service';
import { CreateSpotDto } from './dto/create-spot.dto';
import { UpdateSpotDto } from './dto/update-spot.dto';
import { Spot } from '@prisma/client';

@Controller('spot')
export class SpotController {
  constructor(private readonly spotService: SpotService) {}

  @Post()
  create(@Body() createSpotDto: CreateSpotDto): Promise<Spot> {
    return this.spotService.create(createSpotDto);
  }

  @Post('batch/:itineraryId')
  createMany(
    @Param('itineraryId', ParseIntPipe) itineraryId: number,
    @Body() createSpotDtos: CreateSpotDto[],
  ): Promise<Spot[]> {
    return this.spotService.createManyForItinerary(itineraryId, createSpotDtos);
  }

  @Get('categories')
  async getAllCategories(): Promise<string[]> {
    return this.spotService.getAllCategories();
  }

  @Get('itinerary/:itineraryId')
  findByItineraryId(
    @Param('itineraryId', ParseIntPipe) itineraryId: number,
  ): Promise<Spot[]> {
    return this.spotService.findByItineraryId(itineraryId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Spot> {
    return this.spotService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSpotDto: UpdateSpotDto,
  ): Promise<Spot> {
    return this.spotService.update(id, updateSpotDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.spotService.remove(id);
  }
}
