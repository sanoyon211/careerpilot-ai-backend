import jwt from 'jsonwebtoken';
import { TJwtPayload } from '../interface/jwtPayload';

export const createToken = (
  jwtPayload: TJwtPayload,
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn: expiresIn as any,
  });
};
