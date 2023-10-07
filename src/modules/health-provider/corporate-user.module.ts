import { forwardRef, Module } from '@nestjs/common';
import { CorporateUserService } from './corporate-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CorporateUser,
  CorporateUserSettings,
  CorporateUserToken,
  CorporateUserToUser,
} from '@src/typeorm';
import { BcryptService } from '@src/common/injectables';
import { EmailService } from '@src/templates/mail.service';
import { CorporateUserController } from './corporate-user.controller';
import { UserModule } from '../patient/patient.module';

@Module({
  providers: [CorporateUserService, BcryptService, EmailService],
  exports: [CorporateUserService],
  imports: [
    TypeOrmModule.forFeature([
      CorporateUser,
      CorporateUserToken,
      CorporateUserToUser,
      CorporateUserSettings,
    ]),
    forwardRef(() => UserModule),
  ],
  controllers: [CorporateUserController],
})
export class CorporateUserModule {}
