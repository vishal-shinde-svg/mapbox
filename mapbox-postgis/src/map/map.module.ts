import { Module } from '@nestjs/common';
import { MapService } from './map.service';
import { MapController } from './map.controller';
import { map } from './entities/map.entity';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [TypeOrmModule.forFeature([map])],
  controllers: [MapController],
  providers: [MapService],
})
export class MapModule {}
