import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAboutSectionDto {
  @IsString() @IsNotEmpty()
  judul: string;

  @IsString() @IsNotEmpty()
  konten: string;

  @IsOptional() @IsString()
  gambarUrl?: string;

  @IsOptional() @IsInt()
  urutan?: number;
}
