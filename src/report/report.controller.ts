import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { Report } from '@prisma/client';
import { EmailService } from 'src/email/email.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClerkService } from 'src/clerk/clerk.service';
@Controller('report')
export class ReportController {
  constructor(
    private readonly reportService: ReportService,
    private readonly emailService: EmailService,
    private readonly prismaService: PrismaService,
    private readonly clerkService: ClerkService,
  ) {}

  @Post()
  async create(@Body() createReportDto: CreateReportDto): Promise<Report> {
    const report = await this.reportService.create(createReportDto);

    try {
      const itinerary = await this.prismaService.itinerary.findUnique({
        where: { id: createReportDto.itineraryId },
        select: {
          name: true,
          userId: true,
        },
      });

      if (itinerary) {
        const userEmail =
          (await this.clerkService.getEmail(itinerary.userId)) ||
          'testinglocalsgo@gmail.com';

        let reason = createReportDto.reason;
        switch (createReportDto.reason) {
          case 'location_closed':
            reason = 'one of the locations has been closed';
            break;
          case 'not_displaying':
            reason = 'itinerary not displaying spots';
            break;
          case 'other':
            reason = 'Other';
            break;
        }

        await this.emailService.sendNotification(
          userEmail,
          itinerary.name,
          reason,
          createReportDto.details,
        );
      }
    } catch (error) {
      console.error('Error sending email notification:', error);
    }
    return report;
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.reportService.remove(id);
  }
}
