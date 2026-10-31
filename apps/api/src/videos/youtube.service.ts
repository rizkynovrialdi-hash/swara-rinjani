import { BadRequestException, Injectable } from '@nestjs/common';

export interface YoutubeMetadata {
  youtubeId: string;
  judul: string;
  thumbnail: string;
  durasi: string; // human-readable, e.g. "12:34"
  tanggal: Date;
}

@Injectable()
export class YoutubeService {
  private readonly apiKey = process.env.YOUTUBE_API_KEY;

  // True when no API key is configured — callers use this to fall back to
  // manual metadata entry instead of throwing. Remove this fallback path
  // once YOUTUBE_API_KEY is set up for good.
  get isConfigured(): boolean {
    return !!this.apiKey;
  }

  // Accepts a full URL (watch?v=, youtu.be/, embed/) or a raw 11-char video ID.
  extractVideoId(input: string): string {
    const trimmed = input.trim();

    const patterns = [
      /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
      /(?:youtu\.be\/)([\w-]{11})/,
      /(?:youtube\.com\/embed\/)([\w-]{11})/,
    ];

    for (const pattern of patterns) {
      const match = trimmed.match(pattern);
      if (match) return match[1];
    }

    // Assume it's already a raw video ID
    if (/^[\w-]{11}$/.test(trimmed)) return trimmed;

    throw new BadRequestException('Could not extract a valid YouTube video ID from the input');
  }

  async fetchMetadata(videoId: string): Promise<YoutubeMetadata> {
    if (!this.apiKey) {
      throw new BadRequestException(
        'YOUTUBE_API_KEY is not configured. Set it in .env before adding videos.',
      );
    }

    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${this.apiKey}`;
    const response = await fetch(url);
    const data = (await response.json()) as {
      items?: Array<{
        snippet: {
          title: string;
          publishedAt: string;
          thumbnails?: { high?: { url: string }; default?: { url: string } };
        };
        contentDetails: { duration: string };
      }>;
    };

    if (!data.items || data.items.length === 0) {
      throw new BadRequestException('YouTube video not found — check the URL/ID');
    }

    const item = data.items[0];
    const snippet = item.snippet;
    const contentDetails = item.contentDetails;

    return {
      youtubeId: videoId,
      judul: snippet.title,
      thumbnail:
        snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url || '',
      durasi: this.parseIsoDuration(contentDetails.duration),
      tanggal: new Date(snippet.publishedAt),
    };
  }

  // Converts ISO 8601 duration (e.g. "PT1H2M3S") into "1:02:03" or "2:03".
  private parseIsoDuration(iso: string): string {
    const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    const hours = parseInt(match?.[1] || '0', 10);
    const minutes = parseInt(match?.[2] || '0', 10);
    const seconds = parseInt(match?.[3] || '0', 10);

    const pad = (n: number) => n.toString().padStart(2, '0');

    if (hours > 0) {
      return `${hours}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${minutes}:${pad(seconds)}`;
  }
}
