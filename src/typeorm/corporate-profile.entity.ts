import { ApiProperty } from '@nestjs/swagger';
import { Base } from './base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class CorporateProfile extends Base {
  @ApiProperty({
    type: String,
  })
  @Column({
    nullable: true,
    type: String,
  })
  url?: string;
}
