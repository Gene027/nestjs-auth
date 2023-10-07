import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseWithExclusion } from './base-with-exclusion';

@Entity()
export class CorporateUserSettings extends BaseWithExclusion {
  @ApiProperty({
    type: Boolean,
  })
  @Column({
    nullable: false,
    type: Boolean,
    default: true,
  })
  showPopupNotifications: boolean;

  @ApiProperty({
    type: Boolean,
  })
  @Column({
    nullable: false,
    type: Boolean,
    default: true,
  })
  notificationSound: boolean;
}
