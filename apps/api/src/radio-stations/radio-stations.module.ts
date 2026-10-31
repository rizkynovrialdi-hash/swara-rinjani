import { Module } from '@nestjs/common';
import { RadioStationsController } from './radio-stations.controller';
import { RadioStationsService } from './radio-stations.service';

@Module({
  controllers: [RadioStationsController],
  providers: [RadioStationsService],
})
export class RadioStationsModule {}
