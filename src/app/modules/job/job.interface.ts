import { Types } from 'mongoose';

export type TJob = {
  title: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  salaryRange?: string;
  employerId: Types.ObjectId;
  status: 'Active' | 'Draft' | 'Closed';
  applicantsCount: number;
  isDeleted: boolean;
};
