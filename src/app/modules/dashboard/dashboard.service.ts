import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { Application } from '../application/application.model';
import { SavedJob } from '../savedJob/savedJob.model';
import { Job } from '../job/job.model';

const getJobSeekerStats = async (userEmail: string) => {
  const user = await User.findOne({ email: userEmail });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  const appliedJobsCount = await Application.countDocuments({ applicant: user._id });
  const savedJobsCount = await SavedJob.countDocuments({ user: user._id });
  
  return {
    appliedJobs: appliedJobsCount,
    savedJobs: savedJobsCount,
    profileViews: Math.floor(Math.random() * 50) + 10, // Simulated for now
    aiMatchScore: "85%", // Simulated for now
  };
};

const getEmployerStats = async (userEmail: string) => {
  const user = await User.findOne({ email: userEmail });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  const postedJobsCount = await Job.countDocuments({ employer: user._id });
  // Need to get all applications for jobs posted by this employer
  const employerJobs = await Job.find({ employer: user._id }).select('_id');
  const jobIds = employerJobs.map(job => job._id);
  
  const totalApplicantsCount = await Application.countDocuments({ job: { $in: jobIds } });

  return {
    postedJobs: postedJobsCount,
    totalApplicants: totalApplicantsCount,
    profileViews: Math.floor(Math.random() * 50) + 10, // Simulated
  };
};

export const DashboardServices = {
  getJobSeekerStats,
  getEmployerStats,
};
