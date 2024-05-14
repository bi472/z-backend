import { Module } from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { TweetsController } from './tweets.controller';
import { Tweet } from './entities/tweet.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { TweetFilterDecorator } from './filters/content.filter.decorator';

@Module({
  imports: [TypeOrmModule.forFeature([Tweet]), UsersModule],
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
