//import { PartialType } from '@nestjs/mapped-types';
import { CreateMapDto } from './create-map.dto';

export class UpdateMapDto {
id: number;
  lat: string;
  lon: string;
  name: string;
  cityName: string;
}



