import { Schema, model } from 'mongoose';
import { ISavedJob } from './savedJob.interface';

const savedJobSchema = new Schema<ISavedJob>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    job: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// A user can only save a specific job once
savedJobSchema.index({ user: 1, job: 1 }, { unique: true });

export const SavedJob = model<ISavedJob>('SavedJob', savedJobSchema);
