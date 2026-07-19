import { Types } from 'mongoose';

export type TApplication = {
  jobId: Types.ObjectId;
  applicantId: Types.ObjectId;
  applicantName?: string;
  applicantEmail?: string;
  applicantPhone?: string;
  resumeUrl: string;
  coverLetter?: string;
  status: 'In Review' | 'Interview' | 'Applied' | 'Reviewed' | 'Shortlisted' | 'Rejected' | 'Hired';
  isDeleted: boolean;
};
