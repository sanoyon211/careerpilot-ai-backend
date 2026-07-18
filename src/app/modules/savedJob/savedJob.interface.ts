import { Types } from 'mongoose';

export interface ISavedJob {
  user: Types.ObjectId;
  job: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
