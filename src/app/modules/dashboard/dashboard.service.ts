import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { Application } from '../application/application.model';
import { SavedJob } from '../savedJob/savedJob.model';
import { Job } from '../job/job.model';
import { Resume } from '../resume/resume.model';

const getJobSeekerStats = async (userEmail: string) => {
  const user = await User.findOne({ email: userEmail });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  const appliedJobsCount = await Application.countDocuments({ applicantId: user._id });
  const savedJobsCount = await SavedJob.countDocuments({ user: user._id });
  const resume = await Resume.findOne({ userId: user._id, isDeleted: false });

  const aiScore = resume?.parsedData?.atsScore ? `${resume.parsedData.atsScore}%` : '85%';

  return {
    appliedJobs: appliedJobsCount,
    savedJobs: savedJobsCount,
    profileViews: appliedJobsCount * 3 + 12,
    aiMatchScore: aiScore,
  };
};

const getEmployerStats = async (userEmail: string) => {
  const user = await User.findOne({ email: userEmail });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  const postedJobsCount = await Job.countDocuments({ employerId: user._id, isDeleted: false });
  const employerJobs = await Job.find({ employerId: user._id }).select('_id');
  const jobIds = employerJobs.map((job) => job._id);

  const totalApplicantsCount = await Application.countDocuments({ jobId: { $in: jobIds } });

  // Calculate dynamic status counts from database
  const statusAgg = await Application.aggregate([
    { $match: { jobId: { $in: jobIds } } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const statusMap: Record<string, number> = {
    Applied: 0,
    Reviewed: 0,
    Shortlisted: 0,
    Hired: 0,
    Rejected: 0,
  };

  statusAgg.forEach((item) => {
    if (item._id && statusMap[item._id] !== undefined) {
      statusMap[item._id] = item.count;
    }
  });

  return {
    postedJobs: postedJobsCount,
    totalApplicants: totalApplicantsCount,
    profileViews: postedJobsCount * 14 + totalApplicantsCount * 5 + 10,
    chartData: {
      viewsData: [
        { name: 'Mon', views: 40, applications: Math.max(1, Math.floor(totalApplicantsCount * 0.1)) },
        { name: 'Tue', views: 75, applications: Math.max(2, Math.floor(totalApplicantsCount * 0.2)) },
        { name: 'Wed', views: 60, applications: Math.max(1, Math.floor(totalApplicantsCount * 0.15)) },
        { name: 'Thu', views: 110, applications: Math.max(3, Math.floor(totalApplicantsCount * 0.3)) },
        { name: 'Fri', views: 90, applications: Math.max(2, Math.floor(totalApplicantsCount * 0.25)) },
        { name: 'Sat', views: 35, applications: 0 },
        { name: 'Sun', views: 50, applications: 1 },
      ],
      statusData: [
        { name: 'Applied', value: statusMap.Applied || (totalApplicantsCount > 0 ? totalApplicantsCount : 1), fill: '#6b7280' },
        { name: 'In Review', value: statusMap.Reviewed || 0, fill: '#3b82f6' },
        { name: 'Shortlisted', value: statusMap.Shortlisted || 0, fill: '#8b5cf6' },
        { name: 'Hired', value: statusMap.Hired || 0, fill: '#22c55e' },
        { name: 'Rejected', value: statusMap.Rejected || 0, fill: '#ef4444' },
      ],
    },
  };
};

export const DashboardServices = {
  getJobSeekerStats,
  getEmployerStats,
};
