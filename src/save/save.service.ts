import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Save } from '@prisma/client';
import { CreateSaveDto } from './dto/create-save.dto';

@Injectable()
export class SaveService {
  constructor(private prisma: PrismaService) {}

  async create(createSaveDto: CreateSaveDto): Promise<Save> {
    try {
      return await this.prisma.save.create({
        data: createSaveDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(`User already saved this itinerary`);
      }
      throw error;
    }
  }

  async findAll(): Promise<Save[]> {
    return this.prisma.save.findMany();
  }

  async findByItineraryId(itineraryId: number): Promise<Save[]> {
    return this.prisma.save.findMany({
      where: { itineraryId },
    });
  }

  async findByUserId(userId: string): Promise<Save[]> {
    return this.prisma.save.findMany({
      where: { userId },
    });
  }

  async findOne(id: number): Promise<Save> {
    const save = await this.prisma.save.findUnique({
      where: { id },
    });

    if (!save) {
      throw new NotFoundException(`Save with ID ${id} not found`);
    }

    return save;
  }

  async findByUserAndItinerary(
    userId: string,
    itineraryId: number,
  ): Promise<Save | null> {
    return this.prisma.save.findFirst({
      where: {
        userId,
        itineraryId,
      },
    });
  }

  async remove(id: number): Promise<void> {
    try {
      await this.prisma.save.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Save with ID ${id} not found`);
      }
      throw error;
    }
  }

  async toggleSave(createSaveDto: CreateSaveDto): Promise<{ saved: boolean }> {
    const { userId, itineraryId } = createSaveDto;

    const existingSave = await this.findByUserAndItinerary(userId, itineraryId);

    if (existingSave) {
      await this.remove(existingSave.id);
      return { saved: false };
    } else {
      await this.create(createSaveDto);
      return { saved: true };
    }
  }
}
