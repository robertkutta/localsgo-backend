import { IsString, IsOptional, IsArray } from 'class-validator';

export class UpdateItineraryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tripTypes?: string[];
}
