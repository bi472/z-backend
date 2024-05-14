import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entities';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';

export class RefreshTokensService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokensRepository: Repository<RefreshToken>,
    private configService: ConfigService,
  ) {}

  create(refreshToken): Promise<InsertResult> {
    return this.refreshTokensRepository.insert(refreshToken);
  }

  find(uuid: string): Promise<RefreshToken> {
    return this.refreshTokensRepository.findOneOrFail({ where: { uuid } });
  }

  update(uuid: string, refreshToken): Promise<UpdateResult> {
    return this.refreshTokensRepository.update({ uuid: uuid }, refreshToken);
  }

  remove(uuid: string): Promise<DeleteResult> {
    return this.refreshTokensRepository.delete({ uuid });
  }

  findAll(): Promise<RefreshToken[]> {
    return this.refreshTokensRepository.find();
  }

  async createRefreshToken(
    user: User,
    userAgent: string,
    fingerprint: string,
    ip: string,
    remember_me = false,
  ) {
    const expires_at = new Date();

    if (remember_me) expires_at.setMonth(expires_at.getMonth() + 1);
    else expires_at.setDate(expires_at.getDate() + 7);

    if (
      (await this.refreshTokensRepository.count({
        where: {
          user: {
            uuid: user.uuid,
          },
          isRevoked: false,
        },
      })) >= Number(this.configService.get('') || 5)
    ) {
      await this.revokeAll(user.uuid);
    }

    return (
      await this.create({
        userAgent: userAgent,
        fingerprint: fingerprint,
        ip: ip,
        expiresAt: expires_at,
        user: {
          uuid: user.uuid,
        },
      })
    ).generatedMaps[0];
  }

  findByToken(token: string) {
    return token
      ? this.refreshTokensRepository.findOne({
          where: {
            token: token,
          },
          relations: ['user'],
        })
      : null;
  }

  revoke(token: string) {
    return this.refreshTokensRepository.update(
      {
        token: token,
      },
      {
        isRevoked: true,
      },
    );
  }

  async revokeAll(userUUID: string) {
    await this.refreshTokensRepository.update(
      { user: { uuid: userUUID }, isRevoked: false },
      { isRevoked: true },
    );
  }
}
