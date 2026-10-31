import { PartialType } from '@nestjs/mapped-types';
import { CreateRadioStationDto } from './create-radio-station.dto';

// All fields optional — admin can update just one field (e.g. only streamUrl)
export class UpdateRadioStationDto extends PartialType(CreateRadioStationDto) {}
