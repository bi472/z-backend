import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class FileDto {
    @Expose()
    @ApiProperty()
    uuid!: string;

    @Expose()
    @ApiProperty()
    filename!: string;

    @Expose()
    @ApiProperty()
    path!: string;
}
