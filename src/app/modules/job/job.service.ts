import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TJob } from './job.interface';
import { Job } from './job.model';
import { User } from '../user/user.model';

const createJobIntoDB = async (payload: TJob, employerEmail: string) => {
  const employer = await User.findOne({ email: employerEmail });
  if (!employer) throw new AppError(httpStatus.NOT_FOUND, 'Employer not found');
  
  payload.employerId = employer._id;
  const result = await Job.create(payload);
  return result;
};

const getAllJobsFromDB = async (query: Record<string, unknown>) => {
  const filter: any = { isDeleted: false, status: 'Active' };
  
  if (query.searchTerm) {
    filter.$or = [
      { title: { $regex: query.searchTerm, $options: 'i' } },
      { category: { $regex: query.searchTerm, $options: 'i' } },
      { location: { $regex: query.searchTerm, $options: 'i' } },
    ];
  }
  
  if (query.jobType) {
    filter.jobType = query.jobType;
  }
  
  if (query.workMode) {
    filter.workMode = query.workMode;
  }
  
  const result = await Job.find(filter).populate('employerId', 'name avatar');
  return result;
};

const getEmployerJobsFromDB = async (employerEmail: string) => {
  const employer = await User.findOne({ email: employerEmail });
  if (!employer) throw new AppError(httpStatus.NOT_FOUND, 'Employer not found');

  const result = await Job.find({ employerId: employer._id, isDeleted: false });
  return result;
};

const getJobByIdFromDB = async (id: string) => {
  const result = await Job.findById(id).populate('employerId', 'name avatar location');
  if (!result || result.isDeleted) throw new AppError(httpStatus.NOT_FOUND, 'Job not found');
  return result;
};

const deleteJobFromDB = async (id: string, employerEmail: string) => {
  const employer = await User.findOne({ email: employerEmail });
  if (!employer) throw new AppError(httpStatus.NOT_FOUND, 'Employer not found');

  const job = await Job.findById(id);
  if (!job || job.isDeleted) throw new AppError(httpStatus.NOT_FOUND, 'Job not found');

  if (job.employerId.toString() !== employer._id.toString()) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to delete this job');
  }

  const result = await Job.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  return result;
};

export const JobServices = {
  createJobIntoDB,
  getAllJobsFromDB,
  getEmployerJobsFromDB,
  getJobByIdFromDB,
  deleteJobFromDB,
};
