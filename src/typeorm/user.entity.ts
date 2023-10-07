import { Column, Entity, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Base } from './base.entity';
import { Profile } from './profile.entity';
import { ApiProperty } from '@nestjs/swagger';
import { CorporateUserToUser } from './health-provider-to-patient.entity';
import { NormalUserSettings } from './normal-user-settings.entity';

@Entity()
export class User extends Base {
  @ApiProperty()
  @Column({
    nullable: false,
    default: '',
    unique: true,
  })
  email: string;

  @ApiProperty()
  @Column({
    nullable: false,
    default: '',
    unique: true,
  })
  username: string;

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
  nationality: string;

  @ApiProperty()
  @Column({
    nullable: false,
    default: '',
  })
  dateOfBirth: string;

  @ApiProperty()
  @Column({
    nullable: true,
    default: '',
  })
  phone: string;

  @ApiProperty()
  @Column({
    nullable: false,
    default: '',
  })
  address: string;

  @ApiProperty()
  @Column({
    nullable: false,
    default: '',
  })
  state: string;

  @ApiProperty()
  @Column({
    nullable: false,
    default: '',
  })
  city: string;

  @ApiProperty()
  @Column({
    nullable: false,
    default: '',
  })
  postalCode: string;

  @ApiProperty()
  @Column({
    nullable: false,
    default: '',
  })
  careProvider: string;

  @ApiProperty()
  @Column({
    type: Boolean,
    default: false,
    nullable: false,
  })
  newsSubscribed: boolean;

  @ApiProperty()
  @Column({
    nullable: false,
    default: '',
  })
  insurance: string;

  @ApiProperty()
  @Column({
    nullable: false,
    default: '',
  })
  fullname: string;

  @ApiProperty({
    type: Profile,
  })
  @OneToOne(() => Profile, { onDelete: 'CASCADE' })
  @JoinColumn()
  profile: Profile;

  @ApiProperty({
    type: NormalUserSettings,
    nullable: false,
  })
  @OneToOne(() => NormalUserSettings, { onDelete: 'CASCADE' })
  @JoinColumn()
  settings: NormalUserSettings;

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
    (corporateUserToUser) => corporateUserToUser.user,
    {
      cascade: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ referencedColumnName: 'userId' })
  public companies!: CorporateUserToUser[];
}
