import { IsBoolean, IsOptional, IsString } from 'class-validator';

// Updating a video only touches editable/manual fields.
// To change the underlying YouTube video, delete and re-create instead —
// that keeps youtubeId immutable and avoids stale metadata mismatches.
export class UpdateVideoDto {
  @IsOptional() @IsString()
  judul?: string;

  @IsOptional() @IsString()
  pembicara?: string;

  @IsOptional() @IsString()
  kategori?: string;

  @IsOptional() @IsString()
  deskripsi?: string;

  @IsOptional() @IsBoolean()
  sedangLive?: boolean;
}
