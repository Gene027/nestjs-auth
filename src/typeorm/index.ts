import { User } from './user.entity';
import { Admin } from './admin.entity';
import { CorporateUser } from './corporate-user.entity';
import { Profile } from './profile.entity';
import { CorporateUserToken } from './corporate-user-token.entity';
import { UserToken } from './user-token.entity';
import { CorporateUserToUser } from './health-provider-to-patient.entity';
import { NormalUserSettings } from './normal-user-settings.entity';
import { CorporateUserSettings } from './corporate-user-settings.entity';

const entities = [
  User,
  Admin,
  CorporateUser,
  Profile,
  UserToken,
  CorporateUserToken,
  CorporateUserToUser,
  NormalUserSettings,
  CorporateUserSettings,
];

export {
  User,
  Admin,
  CorporateUser,
  Profile,
  UserToken,
  CorporateUserToken,
  CorporateUserToUser,
  NormalUserSettings,
  CorporateUserSettings,
};

export default entities;
