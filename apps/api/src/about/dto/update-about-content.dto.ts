import { IsOptional, IsString } from 'class-validator';

export class UpdateAboutContentDto {
  @IsOptional() @IsString()
  judul?: string;

  @IsOptional() @IsString()
  subjudul?: string;

  @IsOptional() @IsString()
  deskripsi?: string;

  @IsOptional() @IsString()
  deskripsiKedua?: string;

  @IsOptional() @IsString()
  gambarUtama?: string;
}
