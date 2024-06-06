import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { CrudBaseService } from '../common/crud-base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { Inject, forwardRef } from '@nestjs/common';

@Injectable()
export class NotificationsService extends CrudBaseService<
  Notification,
  CreateNotificationDto,
  UpdateNotificationDto> {
  constructor(
    @InjectRepository(Notification)
    protected notificationsRepository: Repository<Notification>,
    protected usersService: UsersService,
  ) {
    super(notificationsRepository);
  }

  async create(dto: CreateNotificationDto): Promise<Notification> {
  const user = await this.usersService.findOneOrFail({ where: { uuid: dto.userId } });

  // Проверка существующего уведомления
  const existingNotification = await this.notificationsRepository.findOne({ where: { type: dto.type, user: user } });

  if (existingNotification) {
    // Обновление существующего уведомления
    const updatedNotification = this.notificationsRepository.merge(existingNotification, dto);
    return this.notificationsRepository.save(updatedNotification);
  }

  // Создание нового уведомления, если существующего нет
  return super.create({ ...dto, user });
}
  
  async read(uuid: string): Promise<Notification> {
    const notification = await this.findOneOrFail({ where: { uuid } });
    notification.read = true;
    return this.notificationsRepository.save(notification);
  }

  async readAll(uuid: string): Promise<Notification[]> {
    const user = await this.usersService.findOneOrFail({ where: { uuid } });

    await this.notificationsRepository
      .createQueryBuilder()
      .update(Notification)
      .set({ read: true })
      .where("user = :uuid", { uuid: user.uuid })
      .andWhere("read = :read", { read: false })
      .execute();

    return super.findMany({ where: { user } });
  }

}
