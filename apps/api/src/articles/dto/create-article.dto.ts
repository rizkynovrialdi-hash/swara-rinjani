import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateArticleDto {
  @IsString() @IsNotEmpty()
  judul: string;

  @IsString() @IsNotEmpty()
  ringkasan: string;

  @IsString() @IsNotEmpty()
  konten: string;

  @IsOptional() @IsString()
  gambarUtama?: string;

  // Optional — defaults to "-" in the service if left blank.
  @IsOptional() @IsString()
  penulis?: string;

  @IsOptional() @IsString()
  kategori?: string;

  @IsOptional() @IsBoolean()
  published?: boolean;
}
