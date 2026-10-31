import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RadioStationsService } from './radio-stations.service';
import { CreateRadioStationDto } from './dto/create-radio-station.dto';
import { UpdateRadioStationDto } from './dto/update-radio-station.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('radio-stations')
export class RadioStationsController {
  constructor(private service: RadioStationsService) {}

  // Public endpoint — used by the visitor-facing frontend
  @Get()
  findAll(@Query('includeInactive') includeInactive?: string) {
    return this.service.findAll(includeInactive === 'true');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // Admin-only endpoints below
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateRadioStationDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRadioStationDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
