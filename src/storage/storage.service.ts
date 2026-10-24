import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { envs } from '../config/envs';

@Injectable()
export class StorageService {
  private readonly s3Client: S3Client;
  private readonly logger = new Logger(StorageService.name);

  constructor() {
    this.s3Client = new S3Client({
      region: envs.AWS_REGION,
      credentials:
        envs.AWS_ACCESS_KEY_ID && envs.AWS_SECRET_ACCESS_KEY
          ? {
              accessKeyId: envs.AWS_ACCESS_KEY_ID,
              secretAccessKey: envs.AWS_SECRET_ACCESS_KEY,
              sessionToken: envs.AWS_SESSION_TOKEN || undefined,
            }
          : undefined,
    });
  }

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    try {
      const cleanFolder = folder.replace(/\/+$/, '').replace(/^\/+/, '');
      const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
      const key = `${cleanFolder}/${Date.now()}-${randomUUID()}-${sanitizedName}`;

      const command = new PutObjectCommand({
        Bucket: envs.AWS_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.s3Client.send(command);

      const publicUrl = `https://${envs.AWS_BUCKET_NAME}.s3.${envs.AWS_REGION}.amazonaws.com/${key}`;
      this.logger.log(`Archivo subido exitosamente a S3: ${publicUrl}`);
      return publicUrl;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`Error al subir archivo a S3: ${errorMessage}`);
      throw new InternalServerErrorException(
        `Error al subir el archivo a S3: ${errorMessage}`,
      );
    }
  }
}
