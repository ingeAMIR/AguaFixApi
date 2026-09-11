import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateReportDto {
  @IsString({ message: 'La dirección debe ser un texto' })
  @IsNotEmpty({ message: 'La dirección es obligatoria' })
  address: string;

  @IsString({ message: 'La descripción debe ser un texto' })
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  description: string;

  @IsString({ message: 'La severidad debe ser un texto' })
  @IsNotEmpty({ message: 'La severidad es obligatoria' })
  @IsIn(['low', 'medium', 'high'], {
    message:
      'La severidad debe ser uno de los siguientes valores: low, medium, high',
  })
  severity: string;

  @IsString({ message: 'El teléfono debe ser un texto' })
  @IsNotEmpty({ message: 'El teléfono de contacto es obligatorio' })
  reporterPhone: string;
}
