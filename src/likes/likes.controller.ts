import { Controller, Delete, Patch, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { TransformInterceptor } from '../common/transform.interceptor';
import { TweetDto } from '../tweets/dto/tweet.dto';
import { CreateLikeDto } from './dto/create-like.dto';
import { DeleteLikeDto } from './dto/delete-like.dto';
import { LikesService } from './likes.service';

@UseGuards(AuthGuard('jwt'))
@UseInterceptors(new TransformInterceptor(TweetDto))
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Patch(':uuid')
  async like(
    @Req() req: Request & { user: { uuid: string, username: string } }
  ): Promise<any> {
    const dto: CreateLikeDto = { tweetUuid: req.params.uuid, userUuid: req.user.uuid };
    return this.likesService.like(dto);
  }

  @Delete(':uuid')
  async dislike(@Req() req: Request & { user: { uuid: string, username: string } }) {
    const dto: DeleteLikeDto = { tweetUuid: req.params.uuid, userUuid: req.user.uuid };
    return this.likesService.dislike(dto);
  }
}
