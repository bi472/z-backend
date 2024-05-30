import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService
  ) { }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(
    @Req() req: Request & { user: { uuid: string, username: string } }
  ) {
    const uuid = req.user.uuid;
    return this.notificationsService.findMany({ where: { user: { uuid } }, relations: ['createdBy']});
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/readed')
  findReaded(
    @Req() req: Request & { user: { uuid: string, username: string } }
  ) {
    const uuid = req.user.uuid;
    return this.notificationsService.findMany({ where: { user: { uuid }, read: true }, relations: ['createdBy'] });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/unreaded')
  findUnreaded(
    @Req() req: Request & { user: { uuid: string, username: string } }
  ) {
    const uuid = req.user.uuid;
    return this.notificationsService.findMany({ where: { user: { uuid }, read: false }, relations: ['createdBy']} );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':uuid/read')
  read(@Param('uuid') uuid: string) {
    return this.notificationsService.read(uuid);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/read/all')
  readAll(
    @Req() req: Request & { user: { uuid: string, username: string } }
  ) {
    const uuid = req.user.uuid;
    return this.notificationsService.readAll(uuid);
  }

}
