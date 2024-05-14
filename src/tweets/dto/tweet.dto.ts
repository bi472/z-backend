import {Exclude, Expose, Type} from 'class-transformer';
import { UserDto } from '../../users/dto/user.dto';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class TweetDto {
    @Expose()
    @ApiProperty()
    uuid!: string;
    
    @Expose()
    @ApiProperty()
    content!: string;
    
    @Expose()
    @ApiProperty()
    @Type(() => UserDto)
    user!: UserDto;
    
    @Expose()
    @ApiProperty()
    createdAt!: Date;
    
    @Expose()
    @ApiProperty()
    updatedAt!: Date;
}