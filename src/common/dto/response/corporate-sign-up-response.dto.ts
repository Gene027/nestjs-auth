import { ApiProperty } from '@nestjs/swagger';
import { CorporateUser } from 'src/typeorm';
import { SignUpResponseDto } from './sign-up-response.dto';

export class CorporateSignUpResponseDto extends SignUpResponseDto {
  @ApiProperty({
    type: CorporateUser,
  })
  data: CorporateUser;
}
