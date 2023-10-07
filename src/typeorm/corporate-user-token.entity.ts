import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Token } from './token.entity';
import { CorporateUser } from './corporate-user.entity';

@Entity()
export class CorporateUserToken extends Token {
  @JoinColumn()
  @OneToOne(() => CorporateUser, { eager: true })
  user: CorporateUser;

  @Column()
  userId: string;
}
