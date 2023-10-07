import { env } from 'src/common/utils/env';

export const jwtConstants = {
  secret: env.JWT_SECRET || 'jwt',
  adminSecret: env.ADMIN_JWT_SECRET || 'ADMIN',
};
