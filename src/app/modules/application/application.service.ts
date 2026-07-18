import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Application } from './application.model';
import { Job } from '../job/job.model';
import { User } from '../user/user.model';
import { TApplication } from './application.interface';

const createApplicationIntoDB = async (payload: TApplication, applicantEmail: string) => {
  const applicant = await User.findOne({ email: applicantEmail });
  if (!applicant) throw new AppError(httpStatus.NOT_FOUND, 'Applicant not found');

  const job = await Job.findById(payload.jobId);
  if (!job) throw new AppError(httpStatus.NOT_FOUND, 'Job not found');

  const existingApplication = await Application.findOne({ jobId: payload.jobId, applicantId: applicant._id });
  if (existingApplication) {
    throw new AppError(httpStatus.CONFLICT, 'You have already applied for this job');
  }

  payload.applicantId = applicant._id;
  const result = await Application.create(payload);

  // Increment applicants count in job
  await Job.findByIdAndUpdate(payload.jobId, { $inc: { applicantsCount: 1 } });

  return result;
};

const getMyApplicationsFromDB = async (applicantEmail: string) => {
  const applicant = await User.findOne({ email: applicantEmail });
  if (!applicant) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  const result = await Application.find({ applicantId: applicant._id, isDeleted: false })
    .populate('jobId')
    .sort({ createdAt: -1 });
  
  return result;
};

const getJobApplicationsFromDB = async (jobId: string, employerEmail: string) => {
  const employer = await User.findOne({ email: employerEmail });
  if (!employer) throw new AppError(httpStatus.NOT_FOUND, 'Employer not found');

  const job = await Job.findOne({ _id: jobId, employerId: employer._id });
  if (!job) throw new AppError(httpStatus.FORBIDDEN, 'You do not have permission to view applications for this job');

  const result = await Application.find({ jobId, isDeleted: false })
    .populate('applicantId', 'name email phone avatar')
    .sort({ createdAt: -1 });

  return result;
};

const updateApplicationStatusInDB = async (applicationId: string, status: string, employerEmail: string) => {
  const employer = await User.findOne({ email: employerEmail });
  if (!employer) throw new AppError(httpStatus.NOT_FOUND, 'Employer not found');

  const application = await Application.findById(applicationId).populate('jobId');
  if (!application) throw new AppError(httpStatus.NOT_FOUND, 'Application not found');

  const job: any = application.jobId;
  if (job.employerId.toString() !== employer._id.toString()) {
    throw new AppError(httpStatus.FORBIDDEN, 'You do not have permission to update this application');
  }

  application.status = status as any;
  await application.save();

  try {
    const io = require('../../../socket').getIO();
    io.to(application.applicantId.toString()).emit('status_updated', {
      jobTitle: job.title,
      status: status
    });
  } catch (error) {
    console.error('Socket error:', error);
  }

  return application;
};

export const ApplicationServices = {
  createApplicationIntoDB,
  getMyApplicationsFromDB,
  getJobApplicationsFromDB,
  updateApplicationStatusInDB,
};
