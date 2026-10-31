import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { YoutubeService } from './youtube.service';

@Module({
  controllers: [VideosController],
  providers: [VideosService, YoutubeService],
})
export class VideosModule {}
