import { Repository, DataSource } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationRepository extends Repository<Notification> {
  constructor(dataSource: DataSource) {
    super(Notification, dataSource.createEntityManager());
  }
}