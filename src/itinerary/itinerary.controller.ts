import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  ParseFloatPipe,
  Req,
  Logger,
} from '@nestjs/common';
import { Itinerary, Spot } from '@prisma/client';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { UpdateItineraryDto } from './dto/update-itinerary.dto';
import { ItineraryService } from './itinerary.service';
import { SpotService } from '../spot/spot.service';
import { Request } from 'express';

@Controller('itinerary')
export class ItineraryController {
  private readonly logger = new Logger(ItineraryController.name);
  constructor(
    private readonly itineraryService: ItineraryService,
    private readonly spotService: SpotService,
  ) {}

  @Post()
  create(
    @Body() createItineraryDto: CreateItineraryDto,
    @Req() req: Request,
  ): Promise<Itinerary> {
    console.log(
      'Received create itinerary request with data:',
      createItineraryDto,
    );
    try {
      const clerkUserId = req['user']?.sub || req['user']?.id || 'anonymous';
      return this.itineraryService.create({
        ...createItineraryDto,
        userId: clerkUserId,
      });
    } catch (error) {
      console.error('Error in itinerary controller create method:', error);
      throw error;
    }
  }

  @Get()
  findAll(): Promise<Itinerary[]> {
    return this.itineraryService.findAll();
  }

  @Get('near')
  async getItinerariesNear(
    @Query('latitude', ParseFloatPipe) latitude: number,
    @Query('longitude', ParseFloatPipe) longitude: number,
    @Query('radius', ParseFloatPipe) radius: number,
  ): Promise<Itinerary[]> {
    return this.itineraryService.getItinerariesNear(
      latitude,
      longitude,
      radius,
    );
  }

  @Get('filter')
  filterItineraries(
    @Query('tripTypes') tripTypes?: string,
    @Query('derivedCategories') derivedCategories?: string,
  ): Promise<Itinerary[]> {
    const tripTypesArray = tripTypes ? tripTypes.split(',') : undefined;
    const categoriesArray = derivedCategories
      ? derivedCategories.split(',')
      : undefined;

    return this.itineraryService.filterAndSort({
      tripTypes: tripTypesArray,
      categories: categoriesArray,
    });
  }

  @Get('filter-sort')
  async filterAndSortItineraries(
    @Query('tripTypes') tripTypes?: string,
    @Query('derivedCategories') derivedCategories?: string,
    @Query('distanceKm') distanceKmString?: string,
    @Query('sortOption') sortOption?: string,
    @Query('latitude') latitudeString?: string,
    @Query('longitude') longitudeString?: string,
  ): Promise<Itinerary[]> {
    this.logger.log(
      `Received filter-sort request with: sortOption=${sortOption}, latitude=${latitudeString}, longitude=${longitudeString}, distanceKm=${distanceKmString}`,
    );

    const distanceKm = distanceKmString
      ? parseFloat(distanceKmString)
      : undefined;
    const latitude = latitudeString ? parseFloat(latitudeString) : undefined;
    const longitude = longitudeString ? parseFloat(longitudeString) : undefined;

    if (
      (distanceKmString && isNaN(distanceKm!)) ||
      (latitudeString && isNaN(latitude!)) ||
      (longitudeString && isNaN(longitude!))
    ) {
      this.logger.error('Invalid numeric parameters received');
      throw new Error('Invalid numeric parameters');
    }

    const tripTypesArray = tripTypes ? tripTypes.split(',') : undefined;
    const categoriesArray = derivedCategories
      ? derivedCategories.split(',')
      : undefined;

    return this.itineraryService.filterAndSort({
      tripTypes: tripTypesArray,
      categories: categoriesArray,
      distanceKm,
      sortOption: sortOption as 'nearest' | 'recent' | 'popular',
      latitude,
      longitude,
    });
  }

  @Get('filter-sort-map')
  async filterAndSortItinerariesForMap(
    @Query('tripTypes') tripTypes?: string,
    @Query('derivedCategories') derivedCategories?: string,
    @Query('distanceKm') distanceKmString?: string,
    @Query('sortOption') sortOption?: string,
    @Query('latitude') latitudeString?: string,
    @Query('longitude') longitudeString?: string,
  ): Promise<any[]> {
    this.logger.log(
      `Received filter-sort-map request with: sortOption=${sortOption}, latitude=${latitudeString}, longitude=${longitudeString}, distanceKm=${distanceKmString}`,
    );

    const distanceKm = distanceKmString
      ? parseFloat(distanceKmString)
      : undefined;
    const latitude = latitudeString ? parseFloat(latitudeString) : undefined;
    const longitude = longitudeString ? parseFloat(longitudeString) : undefined;

    if (
      (distanceKmString && isNaN(distanceKm!)) ||
      (latitudeString && isNaN(latitude!)) ||
      (longitudeString && isNaN(longitude!))
    ) {
      this.logger.error('Invalid numeric parameters received');
      throw new Error('Invalid numeric parameters');
    }

    const tripTypesArray = tripTypes ? tripTypes.split(',') : undefined;
    const categoriesArray = derivedCategories
      ? derivedCategories.split(',')
      : undefined;

    const itineraries = await this.itineraryService.filterAndSort({
      tripTypes: tripTypesArray,
      categories: categoriesArray,
      distanceKm,
      sortOption: sortOption as 'nearest' | 'recent' | 'popular',
      latitude,
      longitude,
    });

    // Transform the data for map view
    return itineraries.map((itinerary) => ({
      ...itinerary,
      center: [itinerary.latitude, itinerary.longitude],
      zoom: 12,
      locations: itinerary.spots || [],
    }));
  }

  @Get('categories')
  async getAllCategories(): Promise<string[]> {
    return this.spotService.getAllCategories();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Itinerary> {
    return this.itineraryService.findOne(id);
  }

  @Get(':id/spots')
  async getItinerarySpots(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Spot[]> {
    return this.spotService.findByItineraryId(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateItineraryDto: UpdateItineraryDto,
    @Req() req: Request,
  ): Promise<Itinerary> {
    const clerkUserId = req['user']?.sub || req['user']?.id;
    return this.itineraryService.update(id, updateItineraryDto, clerkUserId);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ): Promise<void> {
    const clerkUserId = req['user']?.sub || req['user']?.id;
    return this.itineraryService.remove(id, clerkUserId);
  }

  @Get('user/:userId')
  async getItinerariesByUser(
    @Param('userId') userId: string,
  ): Promise<Itinerary[]> {
    const allItineraries = await this.itineraryService.findAll();

    return allItineraries.filter((itinerary) => itinerary.userId === userId);
  }
}
