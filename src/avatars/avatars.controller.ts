import {
    Controller,
    Delete,
    HttpStatus,
    Post,
    Req, UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { TransformInterceptor } from '../common/transform.interceptor';
import { UserDto } from "../users/dto/user.dto";
import { AvatarsService } from './avatars.service';

@ApiTags('avatars')
@UseInterceptors(new TransformInterceptor(UserDto))
@Controller('avatars')
export class AvatarsController {
    constructor(private readonly avatarsService: AvatarsService) {
    }

    @ApiOperation({summary: 'Upload user avatar'})
    @ApiResponse({
        status: HttpStatus.OK,
        type: UserDto
    })
    @UseInterceptors(
        FileInterceptor('file')
    )
    @UseGuards(AuthGuard('jwt'))
    @Post('/upload')
    async uploadAvatar(
        @Req() req: Request & { user: { uuid: string, username: string } },
        @UploadedFile(
            'file',
        ) file: Express.Multer.File,
    ) {
        const uuid = req.user.uuid
        return this.avatarsService.uploadAvatar(uuid, file)
    }

    @ApiOperation({summary: 'Delete user avatar'})
    @ApiResponse({
        status: HttpStatus.OK,
        type: UserDto
    })
    @UseGuards(AuthGuard('jwt'))
    @Delete('/delete')
    async deleteAvatar(
        @Req() req: Request & { user: { uuid: string, username: string } },
    ) {
        const uuid = req.user.uuid
        return this.avatarsService.deleteAvatar(uuid)
    }


}
