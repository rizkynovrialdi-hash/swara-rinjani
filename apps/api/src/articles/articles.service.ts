import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  // Public list — only published articles, unless admin explicitly asks for all.
  findAll(includeUnpublished = false) {
    return this.prisma.article.findMany({
      where: includeUnpublished ? {} : { published: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    const article = await this.prisma.article.findUnique({ where: { slug } });
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }

  async findOne(id: string) {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }

  async create(dto: CreateArticleDto) {
    const slug = await this.generateUniqueSlug(dto.judul);
    return this.prisma.article.create({
      data: {
        ...dto,
        penulis: dto.penulis?.trim() || '-',
        kategori: dto.kategori?.trim() || '-',
        slug,
      },
    });
  }

  async update(id: string, dto: UpdateArticleDto) {
    await this.findOne(id);
    const data: any = { ...dto };
    if (data.penulis !== undefined) data.penulis = data.penulis.trim() || '-';
    if (data.kategori !== undefined) data.kategori = data.kategori.trim() || '-';
    return this.prisma.article.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.article.delete({ where: { id } });
  }

  // Turns "Judul Artikel Ini!" into "judul-artikel-ini", appending -2, -3, etc.
  // if the base slug is already taken.
  private async generateUniqueSlug(title: string): Promise<string> {
    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    let slug = baseSlug;
    let counter = 2;
    while (await this.prisma.article.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    return slug;
  }
}
