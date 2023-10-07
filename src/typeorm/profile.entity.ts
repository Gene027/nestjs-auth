import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseWithExclusion } from './base-with-exclusion';

@Entity()
export class Profile extends BaseWithExclusion {
  @ApiProperty({
    type: String,
  })
  @Column({
    nullable: true,
    type: String,
  })
  name: string;

  @ApiProperty({
    type: String,
  })
  @Column({
    nullable: true,
    type: String,
  })
  dateOfBirth?: string;

  @ApiProperty({
    type: String,
  })
  @Column({
    nullable: true,
    type: String,
  })
  image: string;
}
