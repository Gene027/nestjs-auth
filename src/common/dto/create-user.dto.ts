import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseSignUpDto } from './base-sign-up.dto';

export class CreateUserDto extends BaseSignUpDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nationality: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  dateOfBirth: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  postalCode: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  careProvider: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  healthProvider: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  insurance: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  newsSubscribed: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    type: String,
  })
  @IsOptional()
  @IsString()
  callbackUrl?: string;
}
