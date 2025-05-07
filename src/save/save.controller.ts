import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { SaveService } from './save.service';
import { CreateSaveDto } from './dto/create-save.dto';
import { Save } from '@prisma/client';

@Controller('save')
export class SaveController {
  constructor(private readonly saveService: SaveService) {}

  @Post()
  create(@Body() createSaveDto: CreateSaveDto): Promise<Save> {
    return this.saveService.create(createSaveDto);
  }

  @Post('toggle')
  toggleSave(
    @Body() createSaveDto: CreateSaveDto,
  ): Promise<{ saved: boolean }> {
    return this.saveService.toggleSave(createSaveDto);
  }

  @Get()
  findAll(): Promise<Save[]> {
    return this.saveService.findAll();
  }

  @Get('itinerary/:itineraryId')
  findByItineraryId(
    @Param('itineraryId', ParseIntPipe) itineraryId: number,
  ): Promise<Save[]> {
    return this.saveService.findByItineraryId(itineraryId);
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string): Promise<Save[]> {
    return this.saveService.findByUserId(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Save> {
    return this.saveService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.saveService.remove(id);
  }
}
