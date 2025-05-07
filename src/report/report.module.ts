import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from 'src/email/email.module';
import { ClerkModule } from 'src/clerk/clerk.module';
@Module({
  imports: [PrismaModule, EmailModule, ClerkModule],
  controllers: [ReportController],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}
