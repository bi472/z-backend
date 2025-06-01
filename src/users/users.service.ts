import { InjectRepository } from '@nestjs/typeorm'
import { FindOneOptions, Repository } from 'typeorm'
import { User } from './entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { CrudBaseService } from '../common/crud-base.service'
import { UpdateUserDto } from './dto/update-user.dto'
import * as bcrypt from 'bcrypt'
import { ConflictException } from '@nestjs/common'
import { Tweet } from '../tweets/entities/tweet.entity'
import { CreateNotificationDto } from '../notifications/dto/create-notification.dto'
import { NotificationType } from '../notifications/notification-type.enum'
import { FilesService } from '../files/files.service'

export class UsersService extends CrudBaseService<User, CreateUserDto, UpdateUserDto> {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {
        super(usersRepository)
    }

    async create(dto: CreateUserDto): Promise<User> {
        const existingUser = await this.usersRepository.findOne({
            where: { username: dto.username }
        })
        if (existingUser) {
            // Если пользователь найден, выбрасываем исключение
            throw new ConflictException('User with this username already exists')
        }
        dto.password = bcrypt.hashSync(dto.password, 10)
        return super.create(dto)
    }

    async update(criteria: FindOneOptions<User>, dto: UpdateUserDto): Promise<User> {
        dto.password = bcrypt.hashSync(dto.password, 10)
        return super.update(criteria, dto)
    }

    async updateBio(uuid: string, biography: string): Promise<User> {
        await super.update({ where: { uuid } }, { biography })
        return this.findOneOrFail({
            where: { uuid },
            relations: ['avatarFile']
        })
    }

    async findLikes(uuid: string): Promise<Tweet[]> {
        const user = await this.findOneOrFail({ where: { uuid }, relations: ['likedTweets'] })
        return user.likedTweets
    }
}
