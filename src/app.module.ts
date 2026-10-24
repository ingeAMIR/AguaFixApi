import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './config/typeorm.config';
import { ReportsModule } from './reports/reports.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    ReportsModule,
    AuthModule,
    EmailModule,
    StorageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
