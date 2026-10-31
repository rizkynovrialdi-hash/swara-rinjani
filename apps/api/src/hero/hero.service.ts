import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateHeroContentDto } from './dto/update-hero-content.dto';

const VALID_LANGS = ['id', 'en'];

const DEFAULTS: Record<
  string,
  { judul: string; judulAksen: string; subjudul: string; deskripsi: string }
> = {
  id: {
    judul: 'Swara',
    judulAksen: 'Rinjani',
    subjudul: 'KOMUNITAS MASYARAKAT · NUSA TENGGARA BARAT',
    deskripsi:
      'Radio online komunitas masyarakat dari Lombok. Musik, kajian bermakna, suara lokal, dan pemberdayaan — kini hadir langsung lewat jaringan Radio Garden untuk pendengar di seluruh dunia.',
  },
  en: {
    judul: 'Swara',
    judulAksen: 'Rinjani',
    subjudul: 'COMMUNITY RADIO · WEST NUSA TENGGARA',
    deskripsi:
      'An online community radio from Lombok. Music, meaningful talks, local voices, and empowerment — now reaching listeners worldwide through the Radio Garden network.',
  },
};

@Injectable()
export class HeroService {
  constructor(private prisma: PrismaService) {}

  private assertValidLang(lang: string) {
    if (!VALID_LANGS.includes(lang)) {
      throw new BadRequestException(`Unsupported language "${lang}". Use "id" or "en".`);
    }
  }

  // Returns both languages — used by the admin panel to populate both tabs at once.
  async findAll() {
    const results = await Promise.all(VALID_LANGS.map((lang) => this.getContent(lang)));
    return results;
  }

  // Upserts with defaults so the site works even before an admin has saved anything.
  async getContent(lang: string) {
    this.assertValidLang(lang);
    return this.prisma.heroContent.upsert({
      where: { id: lang },
      update: {},
      create: { id: lang, ...DEFAULTS[lang] },
    });
  }

  async updateContent(lang: string, dto: UpdateHeroContentDto) {
    this.assertValidLang(lang);
    return this.prisma.heroContent.upsert({
      where: { id: lang },
      update: dto,
      create: { id: lang, ...DEFAULTS[lang], ...dto },
    });
  }
}
