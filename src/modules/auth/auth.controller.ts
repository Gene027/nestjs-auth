import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  UsePipes,
  ValidationPipe,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import {
  CorporateSignUpResponseDto,
  CreateCorporateUserDto,
  LogInDto,
  LogInResponseDto,
  UserSignUpResponseDto,
  SignUpResponseDto,
  VerifyUserDto,
  ResendOTPDto,
  ChangePasswordDto,
} from 'src/common/dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '@src/common/guards/local/local-auth.guard';
import { CreateUserDto } from '@src/common/dto';
import { CorporateLocalAuthGuard } from '@src/common/guards/corporate-local/local-auth.guard';

@ApiTags('Authentication Manager')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: "This handles a patient's login request." })
  @ApiResponse({
    status: 200,
    description: 'Object containing jwt token.',
    type: LogInResponseDto,
  })
  @ApiBody({ type: LogInDto })
  @UseGuards(LocalAuthGuard)
  @Post('patient/login')
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: "This handles a health-provider's login request." })
  @ApiResponse({
    status: 200,
    description: 'Object containing jwt token.',
    type: LogInResponseDto,
  })
  @ApiBody({ type: LogInDto })
  @UseGuards(CorporateLocalAuthGuard)
  @Post('health-provider/login')
  async corporateLogin(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: "This handles a patient's sign up request." })
  @ApiResponse({
    status: 200,
    description: 'Account created successfully.',
    type: UserSignUpResponseDto,
  })
  @ApiBody({ type: CreateUserDto })
  @Post('patient/sign-up')
  @UsePipes(ValidationPipe)
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @ApiOperation({ summary: "This handles a patients's verfication request." })
  @ApiResponse({
    status: 200,
    description: 'Account verified successfully.',
    type: SignUpResponseDto,
  })
  @ApiBody({ type: VerifyUserDto })
  @Post('patient/verify')
  @UsePipes(ValidationPipe)
  verifyUser(@Body() verifyUserDto: VerifyUserDto) {
    const { verificationToken } = verifyUserDto;
    return this.authService.verifyUser(verificationToken);
  }

  @ApiOperation({ summary: 'This resends the patients verification link.' })
  @ApiResponse({
    status: 200,
    description: 'Verification link resent successfully.',
    type: SignUpResponseDto,
  })
  @ApiBody({ type: ResendOTPDto })
  @Post('patient/resend-otp')
  @UsePipes(ValidationPipe)
  resendOtp(@Body() resendOtpDto: ResendOTPDto) {
    const { email, callbackUrl } = resendOtpDto;
    return this.authService.resendOtp(email, callbackUrl);
  }

  @ApiOperation({
    summary: 'This sends a link for resetting the password of a patient.',
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset link sent successfully.',
    type: SignUpResponseDto,
  })
  @ApiBody({ type: ResendOTPDto })
  @Post('patient/forgot-password-begin')
  @UsePipes(ValidationPipe)
  forgotPasswordBegin(@Body() resendOtpDto: ResendOTPDto) {
    const { email, callbackUrl } = resendOtpDto;
    return this.authService.userForgotPasswordBegin(email, callbackUrl);
  }

  @ApiOperation({
    summary: 'This changes the password of a patient.',
  })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully.',
    type: SignUpResponseDto,
  })
  @ApiBody({ type: ChangePasswordDto })
  @Put('patient/forgot-password-end')
  @UsePipes(ValidationPipe)
  forgotPasswordEnd(@Body() changePasswordDto: ChangePasswordDto) {
    const { token, password } = changePasswordDto;
    return this.authService.userForgotPasswordEnd(token, password);
  }

  @ApiOperation({
    summary: "This handles a health provider's sign up request.",
  })
  @ApiResponse({
    status: 200,
    description: 'Account created successfully.',
    type: CorporateSignUpResponseDto,
  })
  @ApiBody({ type: CreateCorporateUserDto })
  @Post('health-provider/sign-up')
  @UsePipes(ValidationPipe)
  createCorporateUser(@Body() createCorporateUserDto: CreateCorporateUserDto) {
    return this.authService.signupCorporate(createCorporateUserDto);
  }

  @ApiOperation({
    summary: 'This handles a health provider verfication request.',
  })
  @ApiResponse({
    status: 200,
    description: 'Account verified successfully.',
    type: SignUpResponseDto,
  })
  @ApiBody({ type: VerifyUserDto })
  @Post('health-provider/verify')
  @UsePipes(ValidationPipe)
  verifyCorporateUser(@Body() verifyUserDto: VerifyUserDto) {
    const { verificationToken } = verifyUserDto;
    return this.authService.verifyCorporateUser(verificationToken);
  }

  @ApiOperation({
    summary: 'This resends the verification OTP of health-provider.',
  })
  @ApiResponse({
    status: 200,
    description: 'OTP resent successfully.',
    type: SignUpResponseDto,
  })
  @ApiBody({ type: ResendOTPDto })
  @Post('health-provider/resend-otp')
  @UsePipes(ValidationPipe)
  resendOtpCorporate(@Body() resendOtpDto: ResendOTPDto) {
    const { email, callbackUrl } = resendOtpDto;
    return this.authService.resendOtpCorporate(email, callbackUrl);
  }

  @ApiOperation({
    summary:
      'This sends a link for resetting the password of a health provider.',
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset link sent successfully.',
    type: SignUpResponseDto,
  })
  @ApiBody({ type: ResendOTPDto })
  @Post('health-provider/forgot-password-begin')
  @UsePipes(ValidationPipe)
  forgotPasswordCorpBegin(@Body() resendOtpDto: ResendOTPDto) {
    const { email, callbackUrl } = resendOtpDto;
    return this.authService.corporateUserForgotPasswordBegin(
      email,
      callbackUrl,
    );
  }

  @ApiOperation({
    summary: 'This changes the password of a health provider.',
  })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully.',
    type: SignUpResponseDto,
  })
  @ApiBody({ type: ChangePasswordDto })
  @Put('health-provider/forgot-password-end')
  @UsePipes(ValidationPipe)
  forgotPasswordCorpEnd(@Body() changePasswordDto: ChangePasswordDto) {
    const { token, password } = changePasswordDto;
    return this.authService.corporateUserForgotPasswordEnd(token, password);
  }
}
