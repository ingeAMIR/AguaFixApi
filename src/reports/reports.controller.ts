import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dtos/create-report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  // 1. POST /reports -> Crea el reporte con foto obligatoria (multipart) y envía correo
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('photo'))
  create(
    @Body() createReportDto: CreateReportDto,
    @UploadedFile() photo?: Express.Multer.File,
  ) {
    if (!photo) {
      throw new BadRequestException('La foto de la fuga es obligatoria');
    }
    return this.reportsService.create(createReportDto, photo);
  }

  // 2. GET /reports -> Lista todos los reportes (incluyendo photoUrl y repairPhotoUrl)
  @Get()
  findAll() {
    return this.reportsService.findAll();
  }

  // 3. GET /reports/:id -> Obtener detalle de un reporte
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reportsService.findOne(id);
  }
}
