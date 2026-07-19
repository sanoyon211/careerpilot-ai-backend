import { Types } from 'mongoose';

export type TResume = {
  userId: Types.ObjectId;
  fileUrl: string;
  fileName?: string;
  parsedData: {
    technicalSkills: string[];
    softSkills: string[];
    experienceSummary: string;
    atsScore?: number;
    atsFeedback?: string[];
  };
  isDeleted: boolean;
};
