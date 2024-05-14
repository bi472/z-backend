import { IsNotEmpty } from 'class-validator';

export class AuthLoginDTO {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  fingerprint: string;

  @IsNotEmpty()
  password: string;

  remember_me: boolean;
}
