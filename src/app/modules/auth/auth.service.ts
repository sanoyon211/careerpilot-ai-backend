import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import bcrypt from 'bcrypt';
import { createToken } from '../../utils/generateToken';
import config from '../../config';
import { v4 as uuidv4 } from 'uuid';

const loginUser = async (payload: TLoginUser) => {
  // check if user exists
  const user = await User.findOne({ email: payload.email }).select('+password');
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }
  // check if user is deleted
  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }

  // check if password matches
  const isPasswordMatched = await bcrypt.compare(payload.password as string, user.password as string);
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
  }

  // create token and send to client
  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt.access_secret as string,
    config.jwt.access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt.refresh_secret as string,
    config.jwt.refresh_expires_in as string,
  );

  const userObj = user.toObject();
  delete userObj.password;

  return {
    accessToken,
    refreshToken,
    user: userObj,
  };
};

const refreshToken = async (token: string) => {
  let decoded;
  try {
    decoded = jwt.verify(
      token,
      config.jwt.refresh_secret as string,
    ) as JwtPayload;
  } catch (err) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }

  const { email } = decoded;

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }
  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt.access_secret as string,
    config.jwt.access_expires_in as string,
  );

  return {
    accessToken,
  };
};

const socialLoginUser = async (payload: { email: string; name: string; photoURL?: string }) => {
  let user = await User.findOne({ email: payload.email });

  if (!user) {
    const randomPassword = uuidv4(); // Generate a random password for social login users
    user = await User.create({
      email: payload.email,
      name: payload.name,
      password: randomPassword,
      role: 'job-seeker', // Default role
      avatar: payload.photoURL || '',
    });
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt.access_secret as string,
    config.jwt.access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt.refresh_secret as string,
    config.jwt.refresh_expires_in as string,
  );

  const userObj = user.toObject();
  delete userObj.password;

  return {
    accessToken,
    refreshToken,
    user: userObj,
  };
};

export const AuthServices = {
  loginUser,
  refreshToken,
  socialLoginUser,
};
