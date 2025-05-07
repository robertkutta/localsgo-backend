import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Report } from '@prisma/client';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}

  async create(createReportDto: CreateReportDto): Promise<Report> {
    return this.prisma.report.create({
      data: createReportDto,
    });
  }

  async remove(id: number): Promise<void> {
    try {
      await this.prisma.report.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Report with ID ${id} not found`);
      }
      throw error;
    }
  }
}
