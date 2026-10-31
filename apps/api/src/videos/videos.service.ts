import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { YoutubeService } from './youtube.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';

@Injectable()
export class VideosService {
  constructor(
    private prisma: PrismaService,
    private youtube: YoutubeService,
  ) {}

  findAll(kategori?: string) {
    return this.prisma.videoItem.findMany({
      where: kategori ? { kategori } : {},
      orderBy: { tanggal: 'desc' },
    });
  }

  async findOne(id: string) {
    const video = await this.prisma.videoItem.findUnique({ where: { id } });
    if (!video) throw new NotFoundException('Video not found');
    return video;
  }

  async create(dto: CreateVideoDto) {
    const videoId = this.youtube.extractVideoId(dto.youtubeUrlOrId);

    const existing = await this.prisma.videoItem.findUnique({ where: { youtubeId: videoId } });
    if (existing) {
      throw new ConflictException('This YouTube video has already been added');
    }

    // Pembicara & kategori are optional — fall back to "-" when left blank.
    const pembicara = dto.pembicara?.trim() || '-';
    const kategori = dto.kategori?.trim() || '-';

    if (this.youtube.isConfigured) {
      // Normal path: auto-fetch title, thumbnail, duration, and publish date from YouTube.
      const metadata = await this.youtube.fetchMetadata(videoId);

      return this.prisma.videoItem.create({
        data: {
          youtubeId: metadata.youtubeId,
          judul: dto.judulOverride || metadata.judul,
          thumbnail: metadata.thumbnail,
          durasi: metadata.durasi,
          tanggal: metadata.tanggal,
          pembicara,
          kategori,
          deskripsi: dto.deskripsi,
        },
      });
    }

    // Fallback path: no YOUTUBE_API_KEY configured yet — use manual fields
    // the admin entered instead of throwing. Remove this branch once the
    // API key is set up for good.
    if (!dto.judulOverride || !dto.thumbnailManual || !dto.durasiManual) {
      throw new BadRequestException(
        'YouTube API key is not configured yet — please fill in judulOverride, thumbnailManual, and durasiManual manually.',
      );
    }

    return this.prisma.videoItem.create({
      data: {
        youtubeId: videoId,
        judul: dto.judulOverride,
        thumbnail: dto.thumbnailManual,
        durasi: dto.durasiManual,
        tanggal: new Date(),
        pembicara,
        kategori,
        deskripsi: dto.deskripsi,
      },
    });
  }

  async update(id: string, dto: UpdateVideoDto) {
    await this.findOne(id);
    const data: any = { ...dto };
    if (data.pembicara !== undefined) data.pembicara = data.pembicara.trim() || '-';
    if (data.kategori !== undefined) data.kategori = data.kategori.trim() || '-';
    return this.prisma.videoItem.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.videoItem.delete({ where: { id } });
  }
}
