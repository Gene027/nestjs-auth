import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './patient.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  User,
  CorporateUser,
  Profile,
  UserToken,
  CorporateUserToUser,
  NormalUserSettings,
} from '@src/typeorm';
import { UserController } from './patient.controller';
import { BcryptService } from 'src/common/injectables';
import { EmailService } from '@src/templates/mail.service';
import { CorporateUserModule } from '../health-provider/corporate-user.module';

@Module({
  providers: [UserService, BcryptService, EmailService],
  exports: [UserService],
  imports: [
    TypeOrmModule.forFeature([
      User,
      CorporateUser,
      CorporateUserToUser,
      Profile,
      UserToken,
      NormalUserSettings,
    ]),
    forwardRef(() => CorporateUserModule),
  ],
  controllers: [UserController],
})
export class UserModule {}
