import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { SavedJob } from './savedJob.model';
import { User } from '../user/user.model';

const saveJob = async (jobId: string, userEmail: string) => {
  const user = await User.findOne({ email: userEmail });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  const existingSave = await SavedJob.findOne({ user: user._id, job: jobId });
  if (existingSave) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Job is already saved');
  }

  const result = await SavedJob.create({ user: user._id, job: jobId });
  return result;
};

const getMySavedJobs = async (userEmail: string) => {
  const user = await User.findOne({ email: userEmail });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  const savedJobs = await SavedJob.find({ user: user._id })
    .populate('job')
    .sort({ createdAt: -1 });
  
  return savedJobs;
};

const removeSavedJob = async (id: string, userEmail: string) => {
  const user = await User.findOne({ email: userEmail });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  const result = await SavedJob.findOneAndDelete({ _id: id, user: user._id });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Saved job not found or not authorized');
  }
  
  return result;
};

export const SavedJobServices = {
  saveJob,
  getMySavedJobs,
  removeSavedJob,
};
