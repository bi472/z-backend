import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

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
  createdAt!: Date;

  @Expose()
  @ApiProperty()
  updatedAt!: Date;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}

