import { IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SpotDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsString()
  placeId: string;

  @IsString()
  address: string;

  @IsString()
  price: string;

  @IsString()
  category: string;
}

export class CreateItineraryDto {
  @IsString()
  userId: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsArray()
  @IsString({ each: true })
  tripTypes: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SpotDto)
  spots: SpotDto[];
}
