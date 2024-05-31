import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { AuthLoginDTO } from './dto/auth.login';
import { AuthRefreshDTO } from './dto/auth.refresh';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthRegisterDTO } from './dto/auth.register';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from '../users/dto/user.dto';
import { TransformInterceptor } from '../common/transform.interceptor';

@ApiTags('auth')
@Controller({ path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
  })
  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() authRegisterDTO: AuthRegisterDTO) {
    await this.authService.register(authRegisterDTO);
    return { message: 'Successfully registered.' };
  }

  @ApiOperation({ summary: 'Login as user' })
  @ApiResponse({
    status: HttpStatus.OK,
  })

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() authLoginDTO: AuthLoginDTO,
    @Req() request,
    @Res() response: Response,
  ) {

    const tokens = await this.authService.login(
      request.get('User-Agent'),
      request.ip,
      authLoginDTO,
    );
    response.cookie('refresh_token', tokens.refresh_token.token, {
      httpOnly: true,
      expires: tokens.refresh_token.expires_at,
      sameSite: 'none',
      secure: true,
    });
    response.send({ access_token: tokens.access_token });
  }

  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body() authRefreshDTO: AuthRefreshDTO,
    @Req() request,
    @Res() response: Response,
  ) {
    const tokens = await this.authService.refresh(
      request.cookies.refresh_token ? request.cookies.refresh_token : '',
      request.get('User-Agent'),
      request.ip,
      authRefreshDTO,
    );
    response.cookie('refresh_token', tokens.refresh_token.token, {
      httpOnly: true,
      expires: tokens.refresh_token.expires_at,
      sameSite: 'none',
    });
    response.send({ access_token: tokens.access_token });
  }

  @ApiOperation({ summary: 'Logout from user account' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Request() request) {
    await this.authService.logout(request.user);
    return { message: 'Successfully logged out.' };
  }

  @ApiOperation({ summary: 'Get user account' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Get('/me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(new TransformInterceptor(UserDto))
  async me(@Request() request) {
    return this.authService.findUser({
      where: { uuid: request.user.uuid },
    });
  }
}
