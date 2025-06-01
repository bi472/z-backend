import { IsNotEmpty, MaxLength, IsOptional, IsArray } from 'class-validator'

export class CreateTweetDto {
    @IsNotEmpty()
    content: string

    @IsOptional()
    @IsArray()
    imageFiles?: string[] // UUIDs of uploaded files

    userUuid: string
}
