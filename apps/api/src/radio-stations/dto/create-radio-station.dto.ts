import { IsInt, IsNotEmpty, IsString, IsUrl, Min } from 'class-validator';

export class CreateRadioStationDto {
  @IsString() @IsNotEmpty()
  name: string;

  @IsString() @IsNotEmpty()
  deskripsi: string;

  @IsString() @IsNotEmpty()
  genre: string;

  @IsUrl()
  streamUrl: string;

  @IsUrl()
  cover: string;

  @IsInt() @Min(0)
  bitrate: number;

  @IsString() @IsNotEmpty()
  penyiar: string;

  @IsString() @IsNotEmpty()
  warna: string;

  @IsString() @IsNotEmpty()
  programSaatIni: string;
}
