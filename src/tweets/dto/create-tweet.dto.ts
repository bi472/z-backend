import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateTweetDto {
    @IsNotEmpty()
    content: string;

    userUuid: string;
}