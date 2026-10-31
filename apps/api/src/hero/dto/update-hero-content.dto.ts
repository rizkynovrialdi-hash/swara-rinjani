import { IsOptional, IsString } from 'class-validator';
import { ArrayMaxSize, ArrayUnique, IsArray, IsUrl,} from 'class-validator';

export class UpdateHeroContentDto {
  @IsOptional() @IsString()
  judul?: string;

  @IsOptional() @IsString()
  judulAksen?: string;

  @IsOptional() @IsString()
  subjudul?: string;

  @IsOptional() @IsString()
  deskripsi?: string;
}

export class UpdateHeroGalleryDto {
  @IsArray()
  @ArrayMaxSize(10)
  @ArrayUnique()
  @IsUrl(
    { protocols: ['https'], require_protocol: true },
    { each: true },
  )
  images!: string[];
}