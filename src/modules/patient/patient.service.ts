import {
  Injectable,
  ConflictException,
  NotFoundException,
  Inject,
  Logger,
  BadRequestException,
  InternalServerErrorException,
  forwardRef,
} from '@nestjs/common';
import {
  User,
  Profile,
  UserToken,
  CorporateUserToUser,
  NormalUserSettings,
} from '@src/typeorm';
import { ERROR, STATUS, USER_TYPE } from 'src/common/enums';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateTokenDto,
  PageDto,
  PageMetaDto,
  PageOptionsDto,
  UpdatePasswordDto,
  UpdateUserDto,
  UpdateUserProfileDto,
  UpdateUserSettingsDto,
} from 'src/common/dto';
import {
  censorEmail,
  createPageOptionFallBack,
  generateVerificationToken,
  getDateMinutesInTheFuture,
} from 'src/common/utils';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/common/dto/create-user.dto';
import { BcryptService } from 'src/common/injectables';
import { EmailService } from '@src/templates/mail.service';
import { CorporateUserService } from '../health-provider/corporate-user.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly bcryptService: BcryptService,
    private readonly emailService: EmailService,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(NormalUserSettings)
    private readonly settingsRepository: Repository<NormalUserSettings>,
    @Inject(forwardRef(() => CorporateUserService))
    private corporateUserService: CorporateUserService,
    @InjectRepository(UserToken)
    private readonly userTokenRepository: Repository<UserToken>,
    @InjectRepository(CorporateUserToUser)
    private readonly corpUserToUserRepo: Repository<CorporateUserToUser>,
  ) {}

  async createProfile(createUserDto: CreateUserDto | UpdateUserProfileDto) {
    const profile = this.profileRepository.create(createUserDto);

    return await this.profileRepository.save(profile);
  }

  async createUser(createUserDto: CreateUserDto) {
    const { email, username, password, callbackUrl } = createUserDto;

    if (await this.findUserByEmail(email)) {
      throw new ConflictException(ERROR.EMAIL_EXISTS);
    }

    if (await this.findUserByUsername(username)) {
      throw new ConflictException(ERROR.USERNAME_EXISTS);
    }

    const profile = await this.createProfile(createUserDto);

    const newUser = this.userRepository.create({
      ...createUserDto,
      email,
      password: await this.bcryptService.hash(password),
      profile,
    });

    const createdUser = await this.userRepository.save(newUser);

    await this.createSettings(createdUser, {});

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
        USER_TYPE.PATIENT,
        callbackUrl,
      );
    } catch (e) {
      this.logger.log(
        `There was a problem sending a verification link to ${email}`,
      );
    }

    return createdUser;
  }

  async getUserSettings(id: string): Promise<NormalUserSettings> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { settings: true },
    });

    if (!user) throw new NotFoundException(ERROR.USER_DOES_NOT_EXIST);

    return user.settings || (await this.createSettings(user, {}));
  }

  async createSettings(user: User, dto: UpdateUserSettingsDto) {
    const { notificationSound = true } = dto;

    const toSave = this.settingsRepository.create({
      notificationSound,
    });

    const settings = await this.settingsRepository.save(toSave);
    await this.userRepository.update({ id: user.id }, { settings });
    return settings;
  }

  async updateSettings(dto: UpdateUserSettingsDto, id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { settings: true },
    });

    if (!user) throw new NotFoundException(ERROR.USER_DOES_NOT_EXIST);

    let settings: NormalUserSettings;

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

  async verifyUser(token: string) {
    const tokenObj = await this.findToken(token);

    if (!tokenObj) throw new BadRequestException(ERROR.INVALID_TOKEN);

    const { user } = tokenObj;

    if (user.isVerified)
      throw new ConflictException(ERROR.USER_ALREADY_VERIFIED);

    if (new Date().getTime() > tokenObj.expiryDate.getTime())
      throw new ConflictException(ERROR.VERIFICATION_TOKEN_EXPIRED);

    user.isVerified = true;

    await this.userRepository.save(user);

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
        USER_TYPE.PATIENT,
        callbackUrl,
      );

      return { message: STATUS.SUCCESS };
    } catch (e) {
      this.logger.error(e);

      return { message: STATUS.FAILED };
    }
  }

  findUserByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  findUserByUsername(username: string) {
    return this.userRepository.findOneBy({ username });
  }

  async findUserById(id: string) {
    try {
      const user = await this.userRepository.findOneBy({ id });

      if (!user) throw new NotFoundException(ERROR.USER_DOES_NOT_EXIST);

      return user;
    } catch (e) {
      this.logger.error(e);
      throw new NotFoundException(ERROR.USER_DOES_NOT_EXIST);
    }
  }

  async findUsersById(ids: string[]): Promise<User[]> {
    const users: User[] = [];

    for (const id of ids) {
      const user = await this.findUserById(id);
      users.push(user);
    }

    return users;
  }

  async getAllUsers(pageOptionsDto: PageOptionsDto): Promise<PageDto<User>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    const pageOptionsDtoFallBack = createPageOptionFallBack(pageOptionsDto);

    queryBuilder
      .orderBy('user.createdAt', pageOptionsDtoFallBack.order)
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.badges', 'badge')
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

  async deleteUserById(id: string) {
    try {
      const user = await this.getUserById(id);

      await this.userRepository.remove(user);

      await this.deleteProfile(user.profile);

      return { message: STATUS.SUCCESS };
    } catch (e) {
      this.logger.error(e);
      return { error: STATUS.FAILED };
    }
  }

  async deleteProfile(profile: Profile) {
    await this.profileRepository.remove(profile);
  }

  async getUserById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: { profile: true },
      });

      if (!user) throw new NotFoundException(ERROR.USER_DOES_NOT_EXIST);

      return user;
    } catch (e) {
      this.logger.error(e);
      throw new NotFoundException(ERROR.USER_DOES_NOT_EXIST);
    }
  }

  async getUsersById(ids: string[]): Promise<User[]> {
    const users: User[] = [];

    for (const id of ids) {
      const user = await this.getUserById(id);
      users.push(user);
    }

    return users;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findUserById(id);

    try {
      await this.userRepository.update({ id: user.id }, updateUserDto);

      return { message: STATUS.SUCCESS, id };
    } catch (e) {
      this.logger.error(e);
      return { error: STATUS.FAILED };
    }
  }

  async updateUserProfile(
    id: string,
    updateUserProfileDto: UpdateUserProfileDto,
  ) {
    const user = await this.getUserById(id);

    const { nationality } = updateUserProfileDto;

    if (nationality) {
      try {
        user.nationality = nationality ? nationality : user.nationality;
        await this.userRepository.save(user);
      } catch (error) {
        this.logger.error(error);
        throw new InternalServerErrorException(ERROR.DATABASE_ERROR);
      }
    }

    if (!user.profile) {
      const profile = await this.createProfile(updateUserProfileDto);

      try {
        await this.userRepository.update({ id }, { profile });

        const updatedUser = await this.getUserProfile(id);

        return { message: STATUS.SUCCESS, id, user: updatedUser };
      } catch (e) {
        return { error: STATUS.FAILED };
      }
    }

    try {
      updateUserProfileDto.nationality = undefined;

      await this.profileRepository.update(
        { id: user.profile.id },
        updateUserProfileDto,
      );

      const updatedUser = await this.getUserProfile(id);

      return { message: STATUS.SUCCESS, id, user: updatedUser };
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException(ERROR.DATABASE_ERROR);
    }
  }

  async updatePassword(user: User, updatePasswordDto: UpdatePasswordDto) {
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
      await this.userRepository.save(user);

      return await this.getUserProfile(user.id);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(ERROR.DATABASE_ERROR);
    }
  }

  async createToken(data: CreateTokenDto) {
    const { userId, token, expiryDate } = data;

    const tokenData = await this.userTokenRepository.findOne({
      where: { userId },
    });

    if (tokenData) {
      tokenData.token = token;
      tokenData.expiryDate = expiryDate;

      return this.userTokenRepository.save(tokenData);
    } else {
      const newToken = this.userTokenRepository.create(data);
      return this.userTokenRepository.save(newToken);
    }
  }

  async findToken(token: string) {
    return this.userTokenRepository.findOne({ where: { token } });
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

      await this.userRepository.save(user);

      return { message: STATUS.SUCCESS };
    } catch (e) {
      return { error: STATUS.FAILED };
    }
  }

  async getUserInfo(id: string) {
    const user = await this.getUserById(id);
    return {
      ...user,
      password: undefined,
    };
  }

  async getUserProfile(id: string, selfCall = false) {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    try {
      const profileInfo = await queryBuilder
        .where('user.id = :id', { id })
        .leftJoinAndSelect('user.profile', 'profile')
        .leftJoinAndSelect('user.badges', 'badge')
        .getOne();

      return {
        ...profileInfo,
        email: selfCall
          ? profileInfo?.email
          : censorEmail(profileInfo?.email || ''),
        password: undefined,
      };
    } catch (e) {
      throw new InternalServerErrorException(ERROR.DATABASE_ERROR);
    }
  }
}
