import 'dotenv/config';
import * as env from 'env-var';

export const envs = {
  PORT: env.get('PORT').default(3000).asPortNumber(),
  DB_HOST: env.get('DB_HOST').required().asString(),
  DB_PORT: env.get('DB_PORT').required().asPortNumber(),
  DB_USER: env.get('DB_USER').required().asString(),
  DB_PASSWORD: env.get('DB_PASSWORD').required().asString(),
  DB_NAME: env.get('DB_NAME').required().asString(),

  // Configuración de correo con Nodemailer
  MAIL_HOST: env
    .get('MAIL_HOST')
    .default('sandbox.smtp.mailtrap.io')
    .asString(),
  MAIL_PORT: env.get('MAIL_PORT').default(2525).asPortNumber(),
  MAIL_USER: env.get('MAIL_USER').default('').asString(),
  MAIL_PASSWORD: env.get('MAIL_PASSWORD').default('').asString(),
  MAIL_FROM: env
    .get('MAIL_FROM')
    .default('"AguaFix Alertas" <no-reply@aguafix.gob.mx>')
    .asString(),
  MAINTENANCE_EMAIL: env
    .get('MAINTENANCE_EMAIL')
    .default('cuadrilla@aguafix.gob.mx')
    .asString(),
};
