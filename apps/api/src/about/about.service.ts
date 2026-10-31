import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateAboutContentDto } from './dto/update-about-content.dto';
import { CreateAboutSectionDto } from './dto/create-about-section.dto';
import { UpdateAboutSectionDto } from './dto/update-about-section.dto';

const MAIN_CONTENT_ID = 'main';

@Injectable()
export class AboutService {
  constructor(private prisma: PrismaService) {}

  // Upserts so the page works even before an admin has saved anything —
  // visitors always get sensible defaults instead of a 404.
  async getContent() {
    return this.prisma.aboutContent.upsert({
      where: { id: MAIN_CONTENT_ID },
      update: {},
      create: { id: MAIN_CONTENT_ID },
    });
  }

  async updateContent(dto: UpdateAboutContentDto) {
    return this.prisma.aboutContent.upsert({
      where: { id: MAIN_CONTENT_ID },
      update: dto,
      create: { id: MAIN_CONTENT_ID, ...dto },
    });
  }

  getSections() {
    return this.prisma.aboutSection.findMany({ orderBy: { urutan: 'asc' } });
  }

  async findSection(id: string) {
    const section = await this.prisma.aboutSection.findUnique({ where: { id } });
    if (!section) throw new NotFoundException('Section not found');
    return section;
  }

  createSection(dto: CreateAboutSectionDto) {
    return this.prisma.aboutSection.create({ data: dto });
  }

  async updateSection(id: string, dto: UpdateAboutSectionDto) {
    await this.findSection(id);
    return this.prisma.aboutSection.update({ where: { id }, data: dto });
  }

  async removeSection(id: string) {
    await this.findSection(id);
    return this.prisma.aboutSection.delete({ where: { id } });
  }
}
