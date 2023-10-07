import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseSignUpDto } from './base-sign-up.dto';

export class CreateCorporateUserDto extends BaseSignUpDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nationality: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  gender: string;

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
  @IsNotEmpty()
  @IsString()
  institution: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  license: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  yearOfExp: string;

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
