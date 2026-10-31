import { IsNotEmpty, IsString } from 'class-validator';

export class CreateScheduleDto {
  @IsString() @IsNotEmpty()
  waktu: string;

  @IsString() @IsNotEmpty()
  waktuSelesai: string;

  @IsString() @IsNotEmpty()
  judul: string;

  @IsString() @IsNotEmpty()
  penyiar: string;

  @IsString() @IsNotEmpty()
  tipe: string;

  @IsString() @IsNotEmpty()
  hari: string;
}
