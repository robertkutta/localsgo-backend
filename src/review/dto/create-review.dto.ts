import { IsString, IsNumber, IsInt, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  userId: string;

  @IsNumber()
  @IsInt()
  itineraryId: number;

  @IsString()
  content: string;

  @IsNumber()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}
