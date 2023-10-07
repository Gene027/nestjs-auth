import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../patient/patient.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '@src/common/guards/local/local.strategy';
import { CorporateLocalStrategy } from '@src/common/guards/corporate-local/local.strategy';
import { JwtStrategy } from '@src/common/guards/jwt/jwt.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { BcryptService } from '@src/common/injectables';
import { jwtConstants } from '@src/common/constants';
import { CorporateUserModule } from '../health-provider/corporate-user.module';
import { CorporateJwtStrategy } from '@src/common/guards/corporate-jwt/jwt.strategy';

@Module({
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    BcryptService,
    CorporateLocalStrategy,
    CorporateJwtStrategy,
  ],
  imports: [
    UserModule,
    CorporateUserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '86400s' },
    }),
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
