import { Module } from '@nestjs/common';
import { HeroController } from './hero.controller';
import { HeroGalleryController } from './hero-gallery.controller';
import { HeroService } from './hero.service';

@Module({
  controllers: [HeroController, HeroGalleryController],
  providers: [HeroService],
})
export class HeroModule {}
