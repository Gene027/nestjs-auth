import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CorporateUserService } from '@src/modules/health-provider/corporate-user.service';
import { jwtConstants } from '@src/common/constants';

@Injectable()
export class CorporateJwtStrategy extends PassportStrategy(
  Strategy,
  'corporate-jwt',
) {
  constructor(private readonly corporateUserService: CorporateUserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    const data = { id: payload.sub, email: payload.email };

    try {
      const user = await this.corporateUserService.findUserById(data.id);

      if (!user) throw new UnauthorizedException();

      return user;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
