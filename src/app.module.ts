import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UsersModule} from './users/users.module';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {AuthModule} from './authentication/auth.module';
import {RefreshTokensModule} from './refresh-tokens/refresh-tokens.module';
import {TweetsModule} from './tweets/tweets.module';
import {MulterModule} from '@nestjs/platform-express';
import {FilesModule} from './files/files.module';
import {NotificationsModule} from './notifications/notifications.module';
import {Notification} from './notifications/entities/notification.entity';
import {Tweet} from './tweets/entities/tweet.entity';
import {User} from './users/entities/user.entity';
import {File} from './files/entities/file.entity';
import {MulterConfigService} from "./common/multer/multer-config.service";
import { AvatarsModule } from './avatars/avatars.module';
import { FollowersModule } from './followers/followers.module';
import { LikesModule } from './likes/likes.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'postgres',
                host: config.get('DB_HOST'),
                port: +config.get<number>('DB_PORT'),
                username: config.get('DB_USERNAME'),
                password: config.get('DB_PASSWORD'),
                database: config.get('DB_DATABASE'),
                autoLoadEntities: true,
                synchronize: true,
            }),
        }),
        UsersModule,
        AuthModule,
        RefreshTokensModule,
        TweetsModule,
        FilesModule,
        NotificationsModule,
        AvatarsModule,
        FollowersModule,
        LikesModule,
        BookmarksModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
