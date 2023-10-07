import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { User } from './user.entity';
import { CorporateUser } from './corporate-user.entity';

@Entity()
export class CorporateUserToUser {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  public corporateUserToUserId!: string;

  @Column('uuid')
  public userId!: string;

  @Column('uuid')
  public corporateUserId!: string;

  @ApiProperty()
  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.companies)
  public user!: User;

  @ManyToOne(() => CorporateUser, (corporateUser) => corporateUser.users)
  public corporateUser!: CorporateUser;

  @ApiProperty()
  @Column({
    type: Boolean,
    default: false,
    nullable: false,
  })
  watchlist: boolean;
}
