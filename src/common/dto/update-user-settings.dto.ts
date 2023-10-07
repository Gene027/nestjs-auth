import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateUserSettingsDto {
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  showPopupNotifications?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  notificationSound?: boolean;
}
