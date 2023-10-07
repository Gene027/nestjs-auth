import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '@src/modules/auth/auth.service';
import { CorporateUser } from 'src/typeorm';
import { ERROR } from '@src/common/enums';

@Injectable()
export class CorporateLocalStrategy extends PassportStrategy(
  Strategy,
  'corporate-local',
) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<CorporateUser> {
    const user = await this.authService.validateCorporateUser(email, password);

    if (!user.isVerified) {
      throw new UnauthorizedException(ERROR.USER_NOT_VERIFIED);
    }

    return user;
  }
}
