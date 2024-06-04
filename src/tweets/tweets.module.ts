import { Module } from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { TweetsController } from './tweets.controller';
import { Tweet } from './entities/tweet.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { TweetFilterDecorator } from './filters/content.filter.decorator';
import { NotificationsModule } from '../notifications/notifications.module';
import { FilesModule } from '../files/files.module'

@Module({
  imports: [TypeOrmModule.forFeature([Tweet]), UsersModule, NotificationsModule, FilesModule],
  controllers: [TweetsController],
  providers: [
    {
        provide: TweetsService,
        useClass: TweetFilterDecorator
    }
  ],
  exports: [TweetsService],
})
export class TweetsModule {}
