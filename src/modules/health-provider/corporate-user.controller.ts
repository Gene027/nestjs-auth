import {
  Controller,
  Request,
  Get,
  Put,
  UseGuards,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateCompanySettingsDto, UpdatePasswordDto } from 'src/common/dto';
import { UpdateCorporateUserDto } from 'src/common/dto/update-corporate-user.dto';
import { CorporateJwtAuthGuard } from '@src/common/guards/corporate-jwt/jwt-auth.guard';
import { CorporateUser, CorporateUserSettings } from '@src/typeorm';
import { CorporateUserService } from './corporate-user.service';

@ApiTags('Health Provider Manager')
@Controller('health-provider')
export class CorporateUserController {
  constructor(private userService: CorporateUserService) {}

  @ApiOperation({
    summary: 'This returns the profile of a health-provider.',
  })
  @ApiResponse({
    status: 200,
    type: CorporateUser,
  })
  @UseGuards(CorporateJwtAuthGuard)
  @Get('profile')
  @UsePipes(ValidationPipe)
  async getProfile(@Request() req: any) {
    return this.userService.findUserById(req.user.id);
  }

  @ApiOperation({ summary: 'This updates the profile of a health-provider.' })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully.',
  })
  @ApiBody({ type: UpdateCorporateUserDto })
  @UseGuards(CorporateJwtAuthGuard)
  @Put('profile')
  @UsePipes(ValidationPipe)
  async updateProfile(
    @Request() req: any,
    @Body() data: UpdateCorporateUserDto,
  ) {
    return this.userService.updateUser(req.user, data);
  }

  @ApiOperation({ summary: 'This updates the password of a health-provider.' })
  @ApiResponse({
    status: 200,
    description: 'Password updated successfully.',
    type: CorporateUser,
  })
  @ApiBody({ type: UpdatePasswordDto })
  @UseGuards(CorporateJwtAuthGuard)
  @Put('profile/update-password')
  @UsePipes(ValidationPipe)
  async updatePassword(@Request() req: any, @Body() data: UpdatePasswordDto) {
    return this.userService.updatePassword(req.user, data);
  }

  @ApiOperation({
    summary: 'This returns the settings of a health-provider.',
  })
  @ApiResponse({
    status: 200,
    type: CorporateUserSettings,
  })
  @UseGuards(CorporateJwtAuthGuard)
  @Get('settings')
  @UsePipes(ValidationPipe)
  async getSettings(@Request() req: any) {
    return this.userService.getUserSettings(req.user.id);
  }

  @ApiOperation({ summary: 'This updates the settings of a health-provider.' })
  @ApiResponse({
    status: 200,
    description: 'Settings updated successfully.',
  })
  @ApiBody({ type: UpdateCompanySettingsDto })
  @UseGuards(CorporateJwtAuthGuard)
  @Put('settings')
  @UsePipes(ValidationPipe)
  async updateSettings(
    @Request() req: any,
    @Body() data: UpdateCompanySettingsDto,
  ) {
    return this.userService.updateSettings(data, req.user.id);
  }
}
