import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AboutService } from './about.service';
import { UpdateAboutContentDto } from './dto/update-about-content.dto';
import { CreateAboutSectionDto } from './dto/create-about-section.dto';
import { UpdateAboutSectionDto } from './dto/update-about-section.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('about')
export class AboutController {
  constructor(private service: AboutService) {}

  // Public — visitor-facing "Tentang Kami" page reads from these two.
  @Get('content')
  getContent() {
    return this.service.getContent();
  }

  @Get('sections')
  getSections() {
    return this.service.getSections();
  }

  // Admin-only — editing the About page content.
  @UseGuards(JwtAuthGuard)
  @Patch('content')
  updateContent(@Body() dto: UpdateAboutContentDto) {
    return this.service.updateContent(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('sections')
  createSection(@Body() dto: CreateAboutSectionDto) {
    return this.service.createSection(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('sections/:id')
  updateSection(@Param('id') id: string, @Body() dto: UpdateAboutSectionDto) {
    return this.service.updateSection(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('sections/:id')
  removeSection(@Param('id') id: string) {
    return this.service.removeSection(id);
  }
}
