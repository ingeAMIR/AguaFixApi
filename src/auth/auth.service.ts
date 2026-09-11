import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly usersRepository: UsersRepository) {}

  // 1. Registro de usuario con contraseña hasheada
  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException(
        `El correo ${createUserDto.email} ya se encuentra registrado`,
      );
    }

    // Hasheo de contraseña con bcryptjs
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );

    const userEntity = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      isNotificationEnabled: createUserDto.isNotificationEnabled ?? true,
    });

    const savedUser = await this.usersRepository.save(userEntity);

    const userResponse = { ...savedUser };
    delete (userResponse as { password?: string }).password;
    return {
      message: 'Usuario registrado exitosamente',
      user: userResponse,
    };
  }

  // 2. Inicio de sesión y validación de credenciales
  async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findByEmail(loginDto.email);

    // Si el usuario no existe, lanzamos BadRequestException con mensaje claro
    if (!user) {
      throw new BadRequestException(
        'Credenciales inválidas: correo o contraseña incorrectos',
      );
    }

    // Validación de la contraseña con bcryptjs
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException(
        'Credenciales inválidas: correo o contraseña incorrectos',
      );
    }

    const userResponse = { ...user };
    delete (userResponse as { password?: string }).password;
    return {
      message: 'Inicio de sesión exitoso',
      user: userResponse,
    };
  }

  // Listar usuarios (útil para auditoría y verificación)
  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.usersRepository.findAll();
    return users.map((user) => {
      const sanitized = { ...user };
      delete (sanitized as { password?: string }).password;
      return sanitized;
    });
  }
}
