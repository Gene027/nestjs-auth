import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  nationality: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  state: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  city: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  postalCode: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  careProvider: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  insurance: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  newsSubscribed: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  fullName: string;
}
