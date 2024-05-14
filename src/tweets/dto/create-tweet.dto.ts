import { IsNotEmpty, MaxLength } from 'class-validator';
import { UserDto } from 'src/users/dto/user.dto';
import { User } from 'src/users/entities/user.entity';

export class CreateTweetDto {
    @IsNotEmpty()
    content: string;

    userUuid: string;
}