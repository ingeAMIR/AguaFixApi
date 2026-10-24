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

  // Configuración de AWS S3
  AWS_REGION: env.get('AWS_REGION').default('us-east-1').asString(),
  AWS_ACCESS_KEY_ID: env.get('AWS_ACCESS_KEY_ID').default('').asString(),
  AWS_SECRET_ACCESS_KEY: env
    .get('AWS_SECRET_ACCESS_KEY')
    .default('')
    .asString(),
  AWS_SESSION_TOKEN: env.get('AWS_SESSION_TOKEN').default('').asString(),
  AWS_BUCKET_NAME: env
    .get('AWS_BUCKET_NAME')
    .default('aguafix-reports-bucket')
    .asString(),
};
