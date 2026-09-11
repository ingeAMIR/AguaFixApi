import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dtos/create-report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  // 1. POST /reports -> Crea el reporte y envía correo
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createReportDto: CreateReportDto) {
    return this.reportsService.create(createReportDto);
  }

  // 2. GET /reports -> Lista todos los reportes
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
