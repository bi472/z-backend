import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateTweetDto {
    @IsNotEmpty()
    @IsString()
    content: string;
}