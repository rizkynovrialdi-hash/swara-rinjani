import { Body, Controller, Get, Patch, UseGuards,} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateHeroGalleryDto } from './dto/update-hero-gallery.dto';

@Controller('hero-gallery')
export class HeroGalleryController {
  constructor(private readonly prisma: PrismaService) {}

  // Public: return the shared carousel in its saved order.
  @Get()
  async getGallery() {
    const gallery = await this.prisma.heroGallery.findUnique({
      where: { id: 'main' },
    });

    return { images: gallery?.images ?? [] };
  }

  // Admin only: replace the carousel with the submitted order.
  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateGallery(@Body() dto: UpdateHeroGalleryDto) {
    const gallery = await this.prisma.heroGallery.upsert({
      where: { id: 'main' },
      update: { images: dto.images },
      create: { id: 'main', images: dto.images },
    });

    return { images: gallery.images };
  }
}