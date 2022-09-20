import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  StreamableFile,
  Res,
} from '@nestjs/common';
import { MapService } from './map.service';
import { CreateMapDto } from './dto/create-map.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { createReadStream, readFileSync } from 'fs';
import type { Response } from 'express';
import { parse } from 'papaparse';
@Controller('map')
export class MapController {
  constructor(private readonly mapService: MapService) {}
  // @Post()
  // create(@Body() createMapDto: CreateMapDto) {
  //   return this.mapService.create(createMapDto);
  // }
  // @Get()
  // findAll() {
  //   return this.mapService.findAll();
  // }
  //   @Post('upload')
  // @UseInterceptors(FileInterceptor('file',{storage:diskStorage({
  //   destination:'./uploads',filename:(req,file,cd)=>{
  //     const fileName:string=path.parse(file.originalname).name
  //   }
  // })}))
  // uploadFile(@UploadedFile() file: Express.Multer.File) {
  // }
  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file', {
  //   storage: diskStorage({
  //     destination: '../mapdatabase',
  //     filename: (req, file, callback) => {
  //       const fileExtName = extname(file.originalname);
  //       callback(null, `data${fileExtName}`);
  //   }
  //   }),
  //   fileFilter:  (req, file, callback) => {
  //     if (!file.originalname.match(/\.(csv)$/)) {
  //         return callback(new Error('Only CSV files are allowed!'), false);
  //     }
  //     callback(null, true);
  // }
  // }))
  // uploadFile(@UploadedFile() file: Express.Multer.File) {
  //   const response = {
  //     message: "File uploaded successfully!",
  //     data: {
  //       originalname: file.originalname,
  //       filename: file.filename,
  //     }
  //   };
  //   return response;
  // }
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './mapbox',
        filename: (req, file, callback) => {
          const fileExtName = extname(file.originalname);
          callback(null, `${file.originalname}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(csv)$/)) {
          return callback(new Error('Only CSV files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const csvFile = readFileSync(`mapbox/${file.originalname}`);
    const csvData = csvFile.toString();
    const parsedCsv = await parse(csvData, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.toLowerCase().replace('#', '').trim(),
      complete: (results) => results.data,
    });

    console.log(parsedCsv.data[0]);
    var point = {
      type: 'Point',
      coordinates: [parsedCsv.data[0].lat, parsedCsv.data[0].lon],
    };

    parsedCsv.data.forEach((element) => {
      var point = {
        type: 'Point',
        coordinates: [element.lat, element.lon],
      };

      const loadData = {
        id: parsedCsv.data[0].id,
        lat: parsedCsv.data[0].lat,
        lon: parsedCsv.data[0].lon,
        cityName: parsedCsv.data[0].city_name,
        location: point,
      };

      console.log(loadData);
      this.mapService.create(loadData);
      const response = {
        message: 'File uploaded successfully!',
        data: {
          originalname: file.originalname,
          // filename: file.filename,
        },
      };
      return response;
    });
  }
  // @Post('file')
  //   @UseInterceptors(
  //     FileInterceptor('file_asset', {
  //       storage: diskStorage({
  //         destination: './mapbox',
  //       })
  //     })
  //   )
  //   async uploadFile() {
  //     const csvFile = readFileSync('mapbox/1(1).csv')
  //     const csvData = csvFile.toString()
  //     const parsedCsv = await parse(csvData, {
  //       header: true,
  //       skipEmptyLines: true,
  //       transformHeader: (header) => header.toLowerCase().replace('#', '').trim(),
  //       complete: (results) => results.data,
  //     });
  //     console.log(parsedCsv)
  //     //console.log(typeof (parsedCsv.data.id))
  //   }

  @Get()
  findAll() {
    return this.mapService.findAll();
  }

  getFile() {
    const file = createReadStream(join(process.cwd(), './mapbox/1(1).csv'));
    console.log(file);
  }
}
