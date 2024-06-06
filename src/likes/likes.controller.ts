import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { DeleteLikeDto } from './dto/delete-like.dto';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Patch(':uuid')
  async like(
    @Req() req: Request & { user: { uuid: string, username: string } }
  ): Promise<any> {
    const dto: CreateLikeDto = { tweetUuid: req.params.uuid, userUuid: req.user.uuid };
    return this.likesService.like(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':uuid')
  async dislike(@Req() req: Request & { user: { uuid: string, username: string } }) {
    const dto: DeleteLikeDto = { tweetUuid: req.params.uuid, userUuid: req.user.uuid };
    return this.likesService.dislike(dto);
  }
}
