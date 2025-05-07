import { IsString, IsNumber, IsInt } from 'class-validator';

export class CreateLikeDto {
  @IsString()
  userId: string;

  @IsNumber()
  @IsInt()
  itineraryId: number;
}
