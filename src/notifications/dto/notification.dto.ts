import { Exclude, Expose, Type } from "class-transformer";
import { NotificationType } from "../notification-type.enum";
import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "src/users/dto/user.dto";
@Exclude()
export class NotificationDto {
    @Expose()
    @ApiProperty()
    uuid!: string;

    @Expose()
    @ApiProperty()
    type!: NotificationType;

    @Expose()
    @ApiProperty()
    read = false;

    @Expose()
    @ApiProperty()
    @Type(() => UserDto)
    user!: UserDto;

    @Expose()
    @ApiProperty()
    @Type(() => UserDto)
    createdBy: UserDto;

    @Expose()
    @ApiProperty()
    tweetId: string;

    @Expose()
    @ApiProperty()
    createdAt!: Date;

    @Expose()
    @ApiProperty()
    updatedAt!: Date;
}