import { Injectable } from '@nestjs/common';
import { CreateMapDto } from './dto/create-map.dto';
import { UpdateMapDto } from './dto/update-map.dto';
import { map } from './entities/map.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MapService {
  constructor(
    @InjectRepository(map)
    private readonly MapRepository: Repository<map>,
  ) {}

  create(createMapDto: CreateMapDto) {
    return this.MapRepository.save(createMapDto);
  }
  // }

  findAll(): Promise<map[]> {
    return this.MapRepository.find();
  }

  

  // findOne(id: number) {
  //   return `This action returns a #${id} map`;
  // }

  // update(id: number, updateMapDto: UpdateMapDto) {
  //   return `This action updates a #${id} map`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} map`;
  // }
}
