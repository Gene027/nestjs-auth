import { ApiProperty } from '@nestjs/swagger';

export class LogInResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  expiresIn: number;
}
