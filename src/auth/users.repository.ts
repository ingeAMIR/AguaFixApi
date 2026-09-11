import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  create(data: DeepPartial<User>): User {
    return this.repository.create(data);
  }

  async save(user: User): Promise<User> {
    return await this.repository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOneBy({ email });
  }

  async findById(id: number): Promise<User | null> {
    return await this.repository.findOneBy({ id });
  }

  async findAll(): Promise<User[]> {
    return await this.repository.find({
      order: { id: 'ASC' },
    });
  }
}
