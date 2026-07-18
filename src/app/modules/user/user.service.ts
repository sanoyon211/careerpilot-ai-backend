import AppError from '../../errors/AppError';
import { TUser } from './user.interface';
import { User } from './user.model';
import httpStatus from 'http-status';

const createUserIntoDB = async (payload: TUser) => {
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new AppError(httpStatus.CONFLICT, 'User already exists');
  }

  const result = await User.create(payload);
  
  // Return user without password
  const userObj = result.toObject();
  delete userObj.password;
  
  return userObj;
};

const getMyProfileFromDB = async (email: string) => {
  const user = await User.findOne({ email, isDeleted: false });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  return user;
};

const updateMyProfileInDB = async (email: string, payload: Partial<TUser>) => {
  const user = await User.findOneAndUpdate({ email, isDeleted: false }, payload, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return user;
};

export const UserServices = {
  createUserIntoDB,
  getMyProfileFromDB,
  updateMyProfileInDB,
};
