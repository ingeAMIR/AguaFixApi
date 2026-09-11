import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Report } from './entities/report.entity';

@Injectable()
export class ReportsRepository {
  constructor(
    @InjectRepository(Report)
    private readonly repository: Repository<Report>,
  ) {}

  create(data: DeepPartial<Report>): Report {
    return this.repository.create(data);
  }

  async save(report: Report): Promise<Report> {
    return await this.repository.save(report);
  }

  async findAll(): Promise<Report[]> {
    return await this.repository.find({
      order: { id: 'ASC' },
    });
  }

  async findById(id: number): Promise<Report | null> {
    return await this.repository.findOneBy({ id });
  }
}
