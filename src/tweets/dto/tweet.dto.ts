import { Exclude, Expose, Type } from 'class-transformer'
import { UserDto } from '../../users/dto/user.dto'
import { FileDto } from '../../files/dto/file.dto'
import { ApiProperty } from '@nestjs/swagger'

@Exclude()
export class TweetDto {
    @Expose()
    @ApiProperty()
    uuid!: string

    @Expose()
    @ApiProperty()
    content!: string

    @Expose()
    @ApiProperty({ type: [FileDto] })
    @Type(() => FileDto)
    images!: FileDto[]

    @Expose()
    @ApiProperty()
    @Type(() => UserDto)
    user!: UserDto

    @Expose()
    @ApiProperty()
    @Type(() => UserDto)
    likedBy!: UserDto[]

    @Expose()
    @ApiProperty()
    @Type(() => UserDto)
    bookmarkedBy!: UserDto[]

    @Expose()
    @ApiProperty()
    createdAt!: Date

    @Expose()
    @ApiProperty()
    updatedAt!: Date
}
