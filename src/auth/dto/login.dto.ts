import { IsString } from 'class-validator';

export class LoginDTO {
  // @Length()
  @IsString()
  username: string;
  // @Length()
  @IsString()
  password: string;
}
