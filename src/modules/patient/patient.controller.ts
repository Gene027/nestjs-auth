import {
  Controller,
  Request,
  Get,
  Put,
  UseGuards,
  Body,
  UsePipes,
  ValidationPipe,
  Param,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  UpdatePasswordDto,
  UpdateUserProfileDto,
  UpdateUserSettingsDto,
} from '@src/common/dto';
import { NormalUserSettings, User } from '@src/typeorm';
import { JwtAuthGuard } from '@src/common/guards/jwt/jwt-auth.guard';
import { UserService } from './patient.service';
import { CorporateUserService } from '../health-provider/corporate-user.service';

@ApiTags('Patient Manager')
@Controller('patient')
export class UserController {
  constructor(
    private userService: UserService,
    private corporateUserService: CorporateUserService,
  ) {}

  @ApiOperation({
    summary: "This returns an overview of a patient's information.",
  })
  @ApiResponse({
    status: 200,
  })
  @UseGuards(JwtAuthGuard)
  @Get('overview')
  @UsePipes(ValidationPipe)
  async getOverview(@Request() req: any) {
    const { id } = req.user;
    return this.userService.getUserInfo(id);
  }

  @ApiOperation({
    summary: "This returns an overview of another patient's information.",
  })
  @ApiResponse({
    status: 200,
  })
  @UseGuards(JwtAuthGuard)
  @Get('overview/:userId')
  @UsePipes(ValidationPipe)
  async getUserOverview(@Param('userId') userId: string) {
    return this.userService.getUserInfo(userId);
  }

  @ApiOperation({
    summary: "This returns a patient's profile information.",
  })
  @ApiResponse({
    status: 200,
    type: User,
  })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @UsePipes(ValidationPipe)
  async getProfile(@Request() req: any) {
    const { id } = req.user;
    return this.userService.getUserProfile(id, true);
  }

  @ApiOperation({
    summary: 'This returns the profile information of another patient.',
  })
  @ApiResponse({
    status: 200,
    type: User,
  })
  @UseGuards(JwtAuthGuard)
  @Get('profile/:userId')
  @UsePipes(ValidationPipe)
  async getUserProfile(@Param('userId') userId: string) {
    return this.userService.getUserProfile(userId);
  }

  @ApiOperation({
    summary: 'This updates the profile information of a patient.',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully.',
    type: User,
  })
  @ApiBody({ type: UpdateUserProfileDto })
  @UseGuards(JwtAuthGuard)
  @Put('profile')
  @UsePipes(ValidationPipe)
  async updateProfile(@Request() req: any, @Body() data: UpdateUserProfileDto) {
    return this.userService.updateUserProfile(req.user.id, data);
  }

  @ApiOperation({ summary: 'This updates the password of a patient.' })
  @ApiResponse({
    status: 200,
    description: 'Password updated successfully.',
    type: User,
  })
  @ApiBody({ type: UpdatePasswordDto })
  @UseGuards(JwtAuthGuard)
  @Put('profile/update-password')
  @UsePipes(ValidationPipe)
  async updatePassword(@Request() req: any, @Body() data: UpdatePasswordDto) {
    return this.userService.updatePassword(req.user.id, data);
  }

  @ApiOperation({
    summary: "This returns a patient's settings information.",
  })
  @ApiResponse({
    status: 200,
    type: NormalUserSettings,
  })
  @UseGuards(JwtAuthGuard)
  @Get('settings')
  @UsePipes(ValidationPipe)
  async getSettings(@Request() req: any) {
    const { id } = req.user;
    return this.userService.getUserSettings(id);
  }

  @ApiOperation({ summary: 'This updates the settings of a patient.' })
  @ApiResponse({
    status: 200,
    description: 'Settings updated successfully.',
    type: NormalUserSettings,
  })
  @ApiBody({ type: UpdateUserSettingsDto })
  @UseGuards(JwtAuthGuard)
  @Put('settings')
  @UsePipes(ValidationPipe)
  async updateSettings(
    @Request() req: any,
    @Body() data: UpdateUserSettingsDto,
  ) {
    return this.userService.updateSettings(data, req.user.id);
  }
}
