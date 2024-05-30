import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  
  JoinColumn,
  
  JoinTable,
  
  ManyToMany,
  
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RefreshToken } from '../../refresh-tokens/entities/refresh-token.entities';
import { Tweet } from 'src/tweets/entities/tweet.entity';
import { File } from 'src/files/entities/file.entity';
import { Notification } from 'src/notifications/entities/notification.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  @Generated('increment')
  id!: number;

  @PrimaryGeneratedColumn('uuid')
  uuid!: string;

  @Column({
    type: 'text',
    nullable: true
  })
  biography: string;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @OneToOne(() => File, { nullable: true })
  avatarFile!: File;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];

  @OneToMany(() => Tweet, (tweet) => tweet.user)
  tweets: Tweet[];

  @ManyToMany(() => Tweet, (tweet) => tweet.likedBy)
  @JoinTable()
  likedTweets: Tweet[];

  @ManyToMany(() => Tweet, (tweet) => tweet.bookmarkedBy)
  @JoinTable()
  bookmarkedTweets: Tweet[];

  @ManyToMany(() => User, (user) => user.following)
  @JoinTable()
  followers: User[];

  @ManyToMany(() => User, (user) => user.followers)
  following: User[];

  @OneToMany(() => Notification, (notification) => notification.user)
  @JoinColumn()
  notifications: Notification[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
