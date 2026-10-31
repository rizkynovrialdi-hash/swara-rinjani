import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { randomUUID } from 'crypto';
import { mkdir, unlink, writeFile } from 'fs/promises';
import { join } from 'path';
import { PrismaService } from '../prisma/prisma.service';
import { UserAuthGuard } from './user-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';

type UserRequest = {
  user: { id: string };
};

// Never return password hashes in profile responses.
const profileSelect = {
  id: true,
  email: true,
  name: true,
  avatarUrl: true,
} as const;

@Controller('users/me')
@UseGuards(UserAuthGuard)
export class ProfileController {
  constructor(private readonly prisma: PrismaService) {}

  private async requireUser(id: string) {
    if (!id) {
      throw new UnauthorizedException('Silakan login kembali.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: profileSelect,
    });

    if (!user) {
      throw new UnauthorizedException('Akun tidak ditemukan.');
    }

    return user;
  }

  @Get()
  getProfile(@Req() req: UserRequest) {
    return this.requireUser(req.user.id);
  }

  @Patch()
  async updateProfile(
    @Req() req: UserRequest,
    @Body() dto: UpdateProfileDto,
  ) {
    await this.requireUser(req.user.id);

    return this.prisma.user.update({
      where: { id: req.user.id },
      data: { name: dto.name },
      select: profileSelect,
    });
  }

  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 2 * 1024 * 1024 },
    }),
  )
  async uploadAvatar(
    @Req() req: UserRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.requireUser(req.user.id);

    if (!file) {
      throw new BadRequestException('Pilih foto terlebih dahulu.');
    }

    // Determine the extension from file signatures, not the filename.
    const buffer = file.buffer;
    let extension: string;

    if (
      buffer.length >= 8 &&
      buffer.subarray(0, 8).equals(
        Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
      )
    ) {
      extension = 'png';
    } else if (
      buffer.length >= 3 &&
      buffer[0] === 0xff &&
      buffer[1] === 0xd8 &&
      buffer[2] === 0xff
    ) {
      extension = 'jpg';
    } else if (
      buffer.length >= 12 &&
      buffer.toString('ascii', 0, 4) === 'RIFF' &&
      buffer.toString('ascii', 8, 12) === 'WEBP'
    ) {
      extension = 'webp';
    } else {
      throw new BadRequestException(
        'Gunakan foto JPG, PNG, atau WebP. Maksimal 2 MB.',
      );
    }

    const directory = join(process.cwd(), 'uploads');
    const filename = `avatar-${randomUUID()}.${extension}`;
    const filepath = join(directory, filename);
    const baseUrl = (
      process.env.API_PUBLIC_URL || 'http://localhost:4000'
    ).replace(/\/+$/, '');

    await mkdir(directory, { recursive: true });
    await writeFile(filepath, buffer);

    try {
      return await this.prisma.user.update({
        where: { id: req.user.id },
        data: {
          avatarUrl: `${baseUrl}/uploads/${filename}`,
        },
        select: profileSelect,
      });
    } catch (error) {
      // Remove the new file if the database update fails.
      await unlink(filepath).catch(() => undefined);
      throw error;
    }
  }

  @Delete('avatar')
  async removeAvatar(@Req() req: UserRequest) {
    await this.requireUser(req.user.id);

    // Clear the profile reference without deleting shared files.
    return this.prisma.user.update({
      where: { id: req.user.id },
      data: { avatarUrl: '' },
      select: profileSelect,
    });
  }
}