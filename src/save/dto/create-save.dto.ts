import { IsString, IsNumber, IsInt } from 'class-validator';

export class CreateSaveDto {
  @IsString()
  userId: string;

  @IsNumber()
  @IsInt()
  itineraryId: number;
}
