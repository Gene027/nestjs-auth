import { Column, Entity, OneToMany, JoinColumn, OneToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Base } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { CorporateUserToUser } from './health-provider-to-patient.entity';
import { CorporateUserSettings } from './corporate-user-settings.entity';

@Entity()
export class CorporateUser extends Base {
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
    nullable: false,
    default: '',
  })
  name: string;

  @ApiProperty()
  @Column({
    nullable: true,
  })
  phoneNumber: string;

  @ApiProperty()
  @Column({
    nullable: true,
  })
  country: string;

  @ApiProperty()
  @Column({
    default: '',
  })
  image: string;

  @ApiProperty()
  @Column({
    type: Boolean,
    default: false,
    nullable: false,
  })
  isVerified: boolean;

  @ApiProperty()
  @Column({
    type: Boolean,
    default: false,
    nullable: false,
  })
  isAdmin: boolean;

  @ApiProperty({
    type: () => CorporateUserToUser,
    isArray: true,
  })
  @OneToMany(
    () => CorporateUserToUser,
    (corporateUserToUser) => corporateUserToUser.corporateUser,
    {
      cascade: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ referencedColumnName: 'corporateUserId' })
  public users!: CorporateUserToUser[];

  @ApiProperty({
    type: CorporateUserSettings,
    nullable: false,
  })
  @OneToOne(() => CorporateUserSettings, { onDelete: 'CASCADE' })
  @JoinColumn()
  settings: CorporateUserSettings;
}
