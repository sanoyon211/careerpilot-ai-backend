import { Types } from 'mongoose';

export type TResume = {
  userId: Types.ObjectId;
  fileUrl: string;
  parsedData: {
    technicalSkills: string[];
    softSkills: string[];
    experienceSummary: string;
  };
  isDeleted: boolean;
};
