import { ApiProperty } from '@nestjs/swagger';
import { STATUS } from '@src/common/enums';

export class SignUpResponseDto {
  @ApiProperty()
  message: STATUS;
}
