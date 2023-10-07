import {
  Injectable,
  ConflictException,
  Logger,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import {
  CorporateUser,
  CorporateUserSettings,
  CorporateUserToken,
  CorporateUserToUser,
} from '@src/typeorm';
import { ERROR, STATUS, USER_TYPE } from 'src/common/enums';
import {
  PageDto,
  PageOptionsDto,
  PageMetaDto,
  CreateTokenDto,
  UpdatePasswordDto,
  UpdateCompanySettingsDto,
} from 'src/common/dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailService } from '@src/templates/mail.service';
import { Repository } from 'typeorm';
import { BcryptService } from '@src/common/injectables';
import { CreateCorporateUserDto } from 'src/common/dto';
import {
  createPageOptionFallBack,
  generateVerificationToken,
  getDateMinutesInTheFuture,
} from 'src/common/utils';
import { UpdateCorporateUserDto } from '@src/common/dto/update-corporate-user.dto';
import { UserService } from '../patient/patient.service';

@Injectable()
export class CorporateUserService {
  private readonly logger = new Logger(CorporateUserService.name);
  constructor(
    @InjectRepository(CorporateUser)
    private readonly corporateUserRepository: Repository<CorporateUser>,
    private readonly bcryptService: BcryptService,
    private readonly emailService: EmailService,
    @InjectRepository(CorporateUserToken)
    private readonly corporateUserTokenRepository: Repository<CorporateUserToken>,
    @InjectRepository(CorporateUserToUser)
    private readonly corporateUserToUserRepository: Repository<CorporateUserToUser>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @InjectRepository(CorporateUserSettings)
    private readonly settingsRepository: Repository<CorporateUserSettings>,
  ) {}

  async createUser(createCorporateUserDto: CreateCorporateUserDto) {
    const { email, password, callbackUrl } = createCorporateUserDto;

    if (await this.findUserByEmail(email)) {
      throw new ConflictException(ERROR.EMAIL_EXISTS);
    }

    const newUser = this.corporateUserRepository.create({
      ...createCorporateUserDto,
      password: await this.bcryptService.hash(password),
    });

    const createdUser = await this.corporateUserRepository.save(newUser);

    const verificationToken = generateVerificationToken();

    await this.createToken({
      token: verificationToken,
      userId: createdUser.id,
      expiryDate: getDateMinutesInTheFuture(5),
    });

    try {
      await this.emailService.sendAccountVerificationLink(
        email,
        verificationToken,
        USER_TYPE.HEALTH_PROVIDER,
        callbackUrl,
      );
    } catch (e) {
      this.logger.log(
        `There was a problem sending a verification link to ${email}`,
      );
    }

    return createdUser;
  }

  async verifyUser(token: string) {
    const tokenObj = await this.findToken(token);

    if (!tokenObj) throw new BadRequestException(ERROR.INVALID_TOKEN);

    const { user } = tokenObj;

    if (user.isVerified)
      throw new ConflictException(ERROR.USER_ALREADY_VERIFIED);

    if (new Date().getTime() > tokenObj.expiryDate.getTime())
      throw new ConflictException(ERROR.VERIFICATION_TOKEN_EXPIRED);

    user.isVerified = true;

    await this.corporateUserRepository.save(user);

    return { message: STATUS.SUCCESS };
  }

  async resendOtp(email: string, callbackUrl?: string) {
    const user = await this.findUserByEmail(email);

    if (!user) throw new NotFoundException(ERROR.EMAIL_DOES_NOT_EXIST);

    if (user.isVerified)
      throw new ConflictException(ERROR.USER_ALREADY_VERIFIED);

    const verificationToken = generateVerificationToken();

    await this.createToken({
      token: verificationToken,
      userId: user.id,
      expiryDate: getDateMinutesInTheFuture(5),
    });

    try {
      await this.emailService.sendAccountVerificationLink(
        email,
        verificationToken,
        USER_TYPE.HEALTH_PROVIDER,
        callbackUrl,
      );

      return { message: STATUS.SUCCESS };
    } catch (e) {
      this.logger.error(e);

      return { message: STATUS.FAILED };
    }
  }

  findUserByEmail(email: string) {
    return this.corporateUserRepository.findOneBy({ email });
  }

  async findUserById(id: string): Promise<CorporateUser> {
    try {
      const user = await this.corporateUserRepository.findOneBy({ id });

      if (!user) throw new NotFoundException(ERROR.USER_DOES_NOT_EXIST);

      return user;
    } catch (e) {
      this.logger.error(e);
      throw new NotFoundException(ERROR.USER_DOES_NOT_EXIST);
    }
  }

  async createSettings(user: CorporateUser, dto: UpdateCompanySettingsDto) {
    const { showPopupNotifications = true, notificationSound = true } = dto;

    const toSave = this.settingsRepository.create({
      showPopupNotifications,
      notificationSound,
    });

    const settings = await this.settingsRepository.save(toSave);
    await this.corporateUserRepository.update({ id: user.id }, { settings });
    return settings;
  }

  async getUserSettings(id: string): Promise<CorporateUserSettings> {
    const user = await this.corporateUserRepository.findOne({
      where: { id },
      relations: { settings: true },
    });

    if (!user) throw new NotFoundException(ERROR.USER_DOES_NOT_EXIST);

    return user.settings || (await this.createSettings(user, {}));
  }

  async updateSettings(dto: UpdateCompanySettingsDto, id: string) {
    const user = await this.corporateUserRepository.findOne({
      where: { id },
      relations: { settings: true },
    });

    if (!user) throw new NotFoundException(ERROR.USER_DOES_NOT_EXIST);

    let settings: CorporateUserSettings;

    if (user.settings) {
      settings = await this.settingsRepository.save({
        ...user.settings,
        ...dto,
      });
    } else {
      settings = await this.createSettings(user, dto);
    }

    return settings;
  }

  async getAllUsers(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<CorporateUser>> {
    const queryBuilder =
      this.corporateUserRepository.createQueryBuilder('corporateUser');

    const pageOptionsDtoFallBack = createPageOptionFallBack(pageOptionsDto);

    queryBuilder
      .orderBy('corporateUser.createdAt', pageOptionsDtoFallBack.order)
      .skip(pageOptionsDtoFallBack.skip)
      .take(pageOptionsDtoFallBack.numOfItemsPerPage);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: pageOptionsDtoFallBack,
    });

    return new PageDto(entities, pageMetaDto);
  }

  async updateUser(user: CorporateUser, updateUserDto: UpdateCorporateUserDto) {
    try {
      await this.corporateUserRepository.update({ id: user.id }, updateUserDto);
      const updatedUser = await this.findUserById(user.id);

      return { message: STATUS.SUCCESS, id: user.id, user: updatedUser };
    } catch (e) {
      this.logger.error(e);
      return { error: STATUS.FAILED };
    }
  }

  async updatePassword(
    user: CorporateUser,
    updatePasswordDto: UpdatePasswordDto,
  ) {
    const { password, confirmPassword, oldPassword } = updatePasswordDto;

    if (!(await this.bcryptService.compare(oldPassword, user.password))) {
      throw new BadRequestException(ERROR.INCORRECT_PASSWORD);
    }

    if (oldPassword === password) {
      throw new BadRequestException(
        'The new password cannot be the same as the old one!',
      );
    }

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match!!');
    }

    try {
      user.password = await this.bcryptService.hash(password);
      await this.corporateUserRepository.save(user);

      return await this.findUserById(user.id);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(ERROR.DATABASE_ERROR);
    }
  }

  async deleteUserById(id: string) {
    try {
      const user = await this.findUserById(id);

      await this.corporateUserRepository.remove(user);

      return { message: STATUS.SUCCESS };
    } catch (e) {
      console.log(e);
      return { error: STATUS.FAILED };
    }
  }

  async createToken(data: CreateTokenDto) {
    const { userId, token, expiryDate } = data;

    const tokenData = await this.corporateUserTokenRepository.findOne({
      where: { userId },
    });

    if (tokenData) {
      tokenData.token = token;
      tokenData.expiryDate = expiryDate;

      return this.corporateUserTokenRepository.save(tokenData);
    } else {
      const newToken = this.corporateUserTokenRepository.create(data);
      return this.corporateUserTokenRepository.save(newToken);
    }
  }

  async findToken(token: string) {
    return this.corporateUserTokenRepository.findOne({ where: { token } });
  }

  async forgotPasswordBegin(email: string, callbackUrl?: string) {
    const user = await this.findUserByEmail(email);

    if (!user) throw new NotFoundException(ERROR.USER_DOES_NOT_EXIST);

    const token = generateVerificationToken();

    const data: CreateTokenDto = {
      token,
      userId: user.id,
      expiryDate: getDateMinutesInTheFuture(5),
    };

    await this.createToken(data);

    try {
      await this.emailService.sendPasswordResetLink(
        email,
        token,
        USER_TYPE.HEALTH_PROVIDER,
        callbackUrl,
      );

      return { message: STATUS.SUCCESS };
    } catch (e) {
      this.logger.error(e);

      return { error: STATUS.FAILED };
    }
  }

  async changePassword(token: string, password: string) {
    const tokenObj = await this.findToken(token);

    if (!tokenObj) throw new BadRequestException(ERROR.INVALID_TOKEN);

    const { user } = tokenObj;

    try {
      user.password = await this.bcryptService.hash(password);

      await this.corporateUserRepository.save(user);

      return { message: STATUS.SUCCESS };
    } catch (e) {
      this.logger.error(e);
      return { error: STATUS.FAILED };
    }
  }
}
