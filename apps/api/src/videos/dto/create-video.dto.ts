import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateVideoDto {
  // Accepts either a raw video ID or a full YouTube URL — the service extracts the ID.
  @IsString() @IsNotEmpty()
  youtubeUrlOrId: string;

  // Optional — defaults to "-" in the service if left blank.
  @IsOptional() @IsString()
  pembicara?: string;

  @IsOptional() @IsString()
  kategori?: string;

  @IsString() @IsNotEmpty()
  deskripsi: string;

  // Optional manual override — if omitted, the title fetched from YouTube is used.
  @IsOptional() @IsString()
  judulOverride?: string;

  // Manual fallback fields — only required when YOUTUBE_API_KEY isn't configured yet.
  // Once the API key is set up, these become unnecessary (auto-fetched instead).
  @IsOptional() @IsString()
  thumbnailManual?: string;

  @IsOptional() @IsString()
  durasiManual?: string;
}
