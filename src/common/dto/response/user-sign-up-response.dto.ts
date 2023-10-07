import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/typeorm';
import { SignUpResponseDto } from './sign-up-response.dto';

export class UserSignUpResponseDto extends SignUpResponseDto {
  @ApiProperty({
    type: User,
  })
  data: User;
}
