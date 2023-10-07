import { Column, Entity } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Base } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Profile } from './profile.entity';

@Entity()
export class Admin extends Base {
  @ApiProperty()
  @Column({
    nullable: false,
    default: '',
  })
  email: string;

  @Exclude()
  @Column({
    nullable: false,
    default: '',
  })
  password: string;

  @ApiProperty()
  @Column({
    nullable: true,
    type: 'jsonb',
  })
  profile: Profile;
}
