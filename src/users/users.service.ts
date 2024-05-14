import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { CrudBaseService } from '../common/crud-base.service';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';

export class UsersService extends CrudBaseService<
  User,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(
    @InjectRepository(User)
    public usersRepository: Repository<User>,
  ) {
    super(usersRepository);
  }

  async create(dto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { username: dto.username },
    });
    if (existingUser) {
      // Если пользователь найден, выбрасываем исключение
      throw new ConflictException('User with this username already exists');
    }
    dto.password = bcrypt.hashSync(dto.password, 10);
    return super.create(dto);
  }

  async update(
    criteria: FindOneOptions<User>,
    dto: UpdateUserDto,
  ): Promise<User> {
    dto.password = bcrypt.hashSync(dto.password, 10);
    return super.update(criteria, dto);
  }
}
