import jwt, { JwtPayload } from 'jsonwebtoken';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';

export const verifyToken = (token: string, secret: string) => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
  }
};
