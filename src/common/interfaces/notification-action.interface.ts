import { ApiProperty } from '@nestjs/swagger';

export class NotificationAction {
  @ApiProperty()
  title: string;

  @ApiProperty()
  link?: string;

  @ApiProperty()
  projectId?: string;
}
