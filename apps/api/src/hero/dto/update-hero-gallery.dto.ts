import { ArrayMaxSize, ArrayUnique, IsArray,IsUrl,} from 'class-validator';

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