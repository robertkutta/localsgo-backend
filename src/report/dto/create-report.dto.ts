import { IsString, IsNumber, IsInt, IsOptional } from 'class-validator';

export class CreateReportDto {
  @IsString()
  userId: string;

  @IsNumber()
  @IsInt()
  itineraryId: number;

  @IsString()
  reason: string;

  @IsOptional()
  @IsString()
  details?: string;
}
