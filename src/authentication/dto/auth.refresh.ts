import { IsNotEmpty } from 'class-validator';

export class AuthRefreshDTO {
  @IsNotEmpty()
  fingerprint: string;
}
