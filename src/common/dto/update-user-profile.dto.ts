import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateUserProfileDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  portfolio?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  nationality?: string;
}
