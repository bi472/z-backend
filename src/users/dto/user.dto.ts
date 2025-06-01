import { Exclude, Expose, Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { User } from '../entities/user.entity'
import { FileDto } from '../../files/dto/file.dto'

export class UserDto {
    @Exclude()
    id!: number

    @Exclude()
    password!: string

    @Expose()
    @ApiProperty()
    uuid!: string

    @Expose()
    @ApiProperty()
    username!: string

    @Expose()
    @ApiProperty()
    bookmarkedTweets: string[]

    @Expose()
    @ApiProperty()
    likedTweets: string[]

    @Expose()
    @ApiProperty()
    tweets: string[]

    @Expose()
    @ApiProperty()
    biography: string

    @Expose()
    @ApiProperty()
    @Type(() => UserDto)
    followers: Partial<UserDto[]>
    @Expose()
    @ApiProperty()
    @Type(() => FileDto)
    avatarFile?: FileDto

    @Expose()
    @ApiProperty()
    @Type(() => UserDto)
    following: Partial<UserDto[]>

    @Expose()
    @ApiProperty()
    createdAt!: Date

    @Expose()
    @ApiProperty()
    updatedAt!: Date

    constructor(partial: Partial<UserDto>) {
        Object.assign(this, partial)
    }
}
