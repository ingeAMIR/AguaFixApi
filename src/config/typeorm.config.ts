import { DataSource, DataSourceOptions } from 'typeorm';
import { envs } from './envs';
import { Report } from '../reports/entities/report.entity';
import { User } from '../auth/entities/user.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: envs.DB_HOST,
  port: envs.DB_PORT,
  username: envs.DB_USER,
  password: envs.DB_PASSWORD,
  database: envs.DB_NAME,
  entities: [Report, User],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: false, // ¡Siempre false cuando se usan migraciones!
  logging: true,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
