import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export type ReportSeverity = 'low' | 'medium' | 'high';

@Entity({ name: 'WATER_REPORT' })
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 20 })
  severity: string;

  @Column({ type: 'varchar', length: 50 })
  reporterPhone: string;

  @Column({ type: 'boolean', default: false })
  isResolved: boolean;

  @Column({ type: 'varchar', length: 500, nullable: true })
  photoUrl: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  repairPhotoUrl: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
