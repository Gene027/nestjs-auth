import { User } from 'src/typeorm';

export const getNameOfUser = (user: User): string => {
  return user.profile?.name
    ? user.profile.name.split(' ')[0]
    : user.username || user.email;
};
