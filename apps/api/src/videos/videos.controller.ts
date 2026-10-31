import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { VideosService } from './videos.service';
import { YoutubeService } from './youtube.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('videos')
export class VideosController {
  constructor(
    private service: VideosService,
    private youtube: YoutubeService,
  ) {}

  // Lets the admin panel know whether to show the manual-entry fallback
  // fields or the normal "just paste a YouTube link" flow.
  @Get('meta/youtube-status')
  getYoutubeStatus() {
    return { configured: this.youtube.isConfigured };
  }

  // Public endpoint — used by the visitor-facing frontend
  @Get()
  findAll(@Query('kategori') kategori?: string) {
    return this.service.findAll(kategori);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // Admin submits a YouTube URL/ID here; metadata is fetched automatically.
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateVideoDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateVideoDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
