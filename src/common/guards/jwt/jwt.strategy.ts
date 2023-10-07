import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@src/modules/patient/patient.service';
import { jwtConstants } from '@src/common/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    const data = { id: payload.sub, email: payload.email };

    try {
      const user = await this.userService.getUserById(data.id);

      if (!user) throw new UnauthorizedException();

      return user;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
