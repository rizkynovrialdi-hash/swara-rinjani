import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRadioStationDto } from './dto/create-radio-station.dto';
import { UpdateRadioStationDto } from './dto/update-radio-station.dto';

@Injectable()
export class RadioStationsService {
  constructor(private prisma: PrismaService) {}

  // Visitors only see active stations; admin panel can pass includeInactive=true.
  findAll(includeInactive = false) {
    return this.prisma.radioStation.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const station = await this.prisma.radioStation.findUnique({ where: { id } });
    if (!station) throw new NotFoundException('Radio station not found');
    return station;
  }

  create(dto: CreateRadioStationDto) {
    return this.prisma.radioStation.create({ data: dto });
  }

  async update(id: string, dto: UpdateRadioStationDto) {
    await this.findOne(id); // throws 404 if not found
    return this.prisma.radioStation.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.radioStation.delete({ where: { id } });
  }
}
