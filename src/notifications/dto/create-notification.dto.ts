import { IsBoolean, IsEnum, IsNotEmpty, IsUUID } from "class-validator";
import { NotificationType } from "../notification-type.enum";
import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "src/users/dto/user.dto";
import { User } from "src/users/entities/user.entity";

export class CreateNotificationDto {
    @ApiProperty()
    @IsEnum(NotificationType)
    type: NotificationType;

    @ApiProperty()
    @IsNotEmpty()
    createdBy: User;
  
    @ApiProperty({ default: false })
    @IsBoolean()
    read?: boolean = false;

    userId?: string;

    tweetId?: string;

  }