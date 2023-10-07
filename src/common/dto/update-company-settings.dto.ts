import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateCompanySettingsDto {
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  showPopupNotifications?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  notificationSound?: boolean;
}
