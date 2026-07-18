import { Types } from 'mongoose';

export type TApplication = {
  jobId: Types.ObjectId;
  applicantId: Types.ObjectId;
  resumeUrl: string;
  coverLetter?: string;
  status: 'In Review' | 'Interview' | 'Applied' | 'Rejected' | 'Hired';
  isDeleted: boolean;
};
