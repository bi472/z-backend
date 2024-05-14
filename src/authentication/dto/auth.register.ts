import { IsNotEmpty } from 'class-validator';

export class AuthRegisterDTO {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
