import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, MinLength } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  @IsOptional()
  username?: string;

  @IsOptional()
  @ApiProperty()
  @MinLength(8)
  password?: string;
}
