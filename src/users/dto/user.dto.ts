import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class UserDto {

  @Exclude()
  id!: number;

  @Exclude()
  password!: string;

  @Expose()
  @ApiProperty()
  uuid!: string;

  @Expose()
  @ApiProperty()
  username!: string;

  @Expose()
  @ApiProperty()
  bookmarkedTweets: string[];

  @Expose()
  @ApiProperty()
  likedTweets: string[];

  @Expose()
  @ApiProperty()
  tweets: string[];

  @Expose()
  @ApiProperty()
  biography: string;

  @Expose()
  @ApiProperty()
  @Type(() => UserDto)
  followers: Partial<UserDto[]>;

  @Expose()
  @ApiProperty()
  avatarFile!: string;

  @Expose()
  @ApiProperty()
  @Type(() => UserDto)
  following: Partial<UserDto[]>;


  @Expose()
  @ApiProperty()
  createdAt!: Date;

  @Expose()
  @ApiProperty()
  updatedAt!: Date;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}

