import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginDTO } from './dto/auth.login';
import { AuthRefreshDTO } from './dto/auth.refresh';
import { UsersService } from '../users/users.service';
import { RefreshTokensService } from '../refresh-tokens/refresh-tokens.service';
import { AuthRegisterDTO } from './dto/auth.register';
import * as bcrypt from 'bcrypt';
import { FindOneOptions } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private refreshTokensService: RefreshTokensService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.usersService.findOne({ where: { username } });
    if (user && bcrypt.compareSync(pass, user.password)) {
      return user;
    }
    return null;
  }

  async login(
    userAgent: string,
    ip: string,
    authLoginDTO: AuthLoginDTO,
  ) {
    const user = await this.validateUser(authLoginDTO.username, authLoginDTO.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const payload = {
      username: user.username,
      sub: user.uuid,
    };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: parseInt(this.configService.get('JWT_EXPIRATION_TIME')) * 60,
      }),
      refresh_token: await this.refreshTokensService.createRefreshToken(
        user,
        userAgent,
        authLoginDTO.fingerprint,
        ip,
        authLoginDTO.remember_me,
      ),
    };
  }

  async refresh(
    token: string,
    userAgent: string,
    ip: string,
    authRefreshDTO: AuthRefreshDTO,
  ) {
    console.log('refresh', token, userAgent, ip, authRefreshDTO);
    const refreshToken = await this.refreshTokensService.findByToken(token);
    if (
      !refreshToken ||
      refreshToken.fingerprint != authRefreshDTO.fingerprint ||
      refreshToken.userAgent != userAgent ||
      refreshToken.isRevoked
    ) {
      throw new UnauthorizedException('Refresh token is not valid');
    }

    await this.refreshTokensService.revoke(token);
    const payload = {
      username: refreshToken.user.username,
      sub: refreshToken.user.uuid,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: parseInt(this.configService.get('JWT_EXPIRATION_TIME')) * 60,
      }),
      refresh_token: await this.refreshTokensService.createRefreshToken(
        refreshToken.user,
        userAgent,
        authRefreshDTO.fingerprint,
        ip,
      ),
    };
  }

  async logout(user) {
    await this.refreshTokensService.revokeAll(user.uuid);
  }

  async register(authRegisterDTO: AuthRegisterDTO) {
    return this.usersService.create(authRegisterDTO);
  }

  async findUser(options: FindOneOptions<User>) {
    return this.usersService.findOne(options);
  }
}
