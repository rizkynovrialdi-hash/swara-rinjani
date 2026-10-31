import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.jadwalItem.findMany({ orderBy: { waktu: 'asc' } });
  }

  async findOne(id: string) {
    const item = await this.prisma.jadwalItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Schedule item not found');
    return item;
  }

  create(dto: CreateScheduleDto) {
    return this.prisma.jadwalItem.create({ data: dto });
  }

  async update(id: string, dto: UpdateScheduleDto) {
    await this.findOne(id);
    return this.prisma.jadwalItem.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.jadwalItem.delete({ where: { id } });
  }
}
