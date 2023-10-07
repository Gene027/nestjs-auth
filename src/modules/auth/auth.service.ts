import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  CreateUserDto,
  CreateCorporateUserDto,
  CorporateSignUpResponseDto,
  UserSignUpResponseDto,
} from 'src/common/dto';
import { CorporateUser, User } from '@src/typeorm';
import { BcryptService } from 'src/common/injectables';
import { UserService } from '../patient/patient.service';
import { ERROR, STATUS } from 'src/common/enums';
import { CorporateUserService } from '../health-provider/corporate-user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private corporateUserService: CorporateUserService,
    private jwtService: JwtService,
    private readonly bcryptService: BcryptService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException(ERROR.INVALID_EMAIL_ADDRESS);
    }

    if (await this.bcryptService.compare(password, user.password)) return user;

    throw new UnauthorizedException(ERROR.INCORRECT_PASSWORD);
  }

  async validateCorporateUser(
    email: string,
    password: string,
  ): Promise<CorporateUser> {
    const user = await this.corporateUserService.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException(ERROR.INVALID_EMAIL_ADDRESS);
    }

    if (await this.bcryptService.compare(password, user.password)) return user;

    throw new UnauthorizedException(ERROR.INCORRECT_PASSWORD);
  }

  async login(user: User | CorporateUser) {
    const payload = { email: user.email, sub: user.id };

    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: 86400 }),
      expiresIn: 86400,
    };
  }

  async verifyUser(token: string) {
    return this.userService.verifyUser(token);
  }

  async verifyCorporateUser(token: string) {
    return this.corporateUserService.verifyUser(token);
  }

  async resendOtp(email: string, callbackUrl?: string) {
    return this.userService.resendOtp(email, callbackUrl);
  }

  async resendOtpCorporate(email: string, callbackUrl?: string) {
    return this.corporateUserService.resendOtp(email, callbackUrl);
  }

  async signup(createUserDto: CreateUserDto): Promise<UserSignUpResponseDto> {
    const user = await this.userService.createUser(createUserDto);

    if (!user) throw new InternalServerErrorException(ERROR.USER_NOT_CREATED);

    return {
      message: STATUS.SUCCESS,
      data: user,
    };
  }

  async signupCorporate(
    createCorporateUserDto: CreateCorporateUserDto,
  ): Promise<CorporateSignUpResponseDto> {
    const user = await this.corporateUserService.createUser(
      createCorporateUserDto,
    );

    if (!user) throw new InternalServerErrorException(ERROR.USER_NOT_CREATED);

    return {
      message: STATUS.SUCCESS,
      data: user,
    };
  }

  async userForgotPasswordBegin(email: string, callbackUrl?: string) {
    return this.userService.forgotPasswordBegin(email, callbackUrl);
  }

  async userForgotPasswordEnd(token: string, password: string) {
    return this.userService.changePassword(token, password);
  }

  async corporateUserForgotPasswordBegin(email: string, callbackUrl?: string) {
    return this.corporateUserService.forgotPasswordBegin(email, callbackUrl);
  }

  async corporateUserForgotPasswordEnd(token: string, password: string) {
    return this.corporateUserService.changePassword(token, password);
  }
}
