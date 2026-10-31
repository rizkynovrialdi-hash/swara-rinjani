import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { HeroService } from './hero.service';
import { UpdateHeroContentDto } from './dto/update-hero-content.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('hero')
export class HeroController {
  constructor(private service: HeroService) {}

  // Public — visitor-facing homepage hero reads from this (by language).
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':lang')
  getContent(@Param('lang') lang: string) {
    return this.service.getContent(lang);
  }

  // Admin-only — editing hero content per language.
  @UseGuards(JwtAuthGuard)
  @Patch(':lang')
  updateContent(@Param('lang') lang: string, @Body() dto: UpdateHeroContentDto) {
    return this.service.updateContent(lang, dto);
  }
}
