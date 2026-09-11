import { Injectable, NotFoundException } from '@nestjs/common';
import { ReportsRepository } from './reports.repository';
import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './entities/report.entity';
import { EmailService } from '../email/email.service';
import { generateReportTemplate } from './templates/report.template';
import { envs } from '../config/envs';

@Injectable()
export class ReportsService {
  constructor(
    private readonly reportsRepository: ReportsRepository,
    private readonly emailService: EmailService,
  ) {}

  // 1. POST /reports -> Guardar reporte y enviar correo a la cuadrilla
  async create(createReportDto: CreateReportDto): Promise<Report> {
    const reportEntity = this.reportsRepository.create(createReportDto);
    const savedReport = await this.reportsRepository.save(reportEntity);

    // Generar plantilla HTML
    const emailHtml = generateReportTemplate({
      ...createReportDto,
      id: savedReport.id,
      createdAt: savedReport.createdAt,
    });

    // Enviar correo a la cuadrilla de mantenimiento
    await this.emailService.sendEmail(
      envs.MAINTENANCE_EMAIL,
      `🚨 Nuevo Reporte de Fuga #${savedReport.id} - ${savedReport.address}`,
      emailHtml,
    );

    return savedReport;
  }

  // 2. GET /reports -> Listar todos los reportes
  async findAll(): Promise<Report[]> {
    return await this.reportsRepository.findAll();
  }

  // 3. GET /reports/:id -> Obtener reporte por ID
  async findOne(id: number): Promise<Report> {
    const report = await this.reportsRepository.findById(id);
    if (!report) {
      throw new NotFoundException(`Reporte con ID ${id} no fue encontrado`);
    }
    return report;
  }
}
