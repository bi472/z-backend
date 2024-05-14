import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('refresh_tokens')
export class RefreshToken extends BaseEntity {
  @Column({ unique: true })
  @Generated('increment')
  id!: number;

  @PrimaryGeneratedColumn('uuid')
  uuid!: string;

  @PrimaryGeneratedColumn('uuid')
  token!: string;

  @Column()
  userAgent!: string;

  @Column()
  fingerprint!: string;

  @Column()
  ip!: string;

  @Column({ default: false })
  isRevoked!: boolean;

  @Column()
  expiresAt!: Date;

  @ManyToOne(() => User, (user) => user.refreshTokens)
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
