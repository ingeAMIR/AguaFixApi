import { Injectable, NotFoundException } from '@nestjs/common';
import { ReportsRepository } from './reports.repository';
import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './entities/report.entity';
import { EmailService } from '../email/email.service';
import { StorageService } from '../storage/storage.service';
import { generateReportTemplate } from './templates/report.template';
import { envs } from '../config/envs';

@Injectable()
export class ReportsService {
  constructor(
    private readonly reportsRepository: ReportsRepository,
    private readonly emailService: EmailService,
    private readonly storageService: StorageService,
  ) {}

  // 1. POST /reports -> Subir foto a S3, guardar reporte y enviar correo a la cuadrilla
  async create(
    createReportDto: CreateReportDto,
    photoFile: Express.Multer.File,
  ): Promise<Report> {
    // Subir foto a S3 en la carpeta 'reports/'
    const photoUrl = await this.storageService.uploadFile(photoFile, 'reports');

    const reportEntity = this.reportsRepository.create({
      ...createReportDto,
      photoUrl,
      repairPhotoUrl: null,
    });
    const savedReport = await this.reportsRepository.save(reportEntity);

    // Generar plantilla HTML con la foto de la fuga
    const emailHtml = generateReportTemplate(
      {
        ...createReportDto,
        id: savedReport.id,
        createdAt: savedReport.createdAt,
      },
      photoUrl,
    );

    // Enviar correo a la cuadrilla de mantenimiento
    await this.emailService.sendEmail(
      envs.MAINTENANCE_EMAIL,
      `🚨 Nuevo Reporte de Fuga #${savedReport.id} - ${savedReport.address}`,
      emailHtml,
    );

    return savedReport;
  }

  // 2. GET /reports -> Listar todos los reportes (incluyendo photoUrl y repairPhotoUrl)
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
