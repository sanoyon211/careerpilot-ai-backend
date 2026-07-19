import { Schema, model } from 'mongoose';
import { TApplication } from './application.interface';

const applicationSchema = new Schema<TApplication>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    applicantId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    applicantName: { type: String },
    applicantEmail: { type: String },
    applicantPhone: { type: String },
    resumeUrl: { type: String, required: true },
    coverLetter: { type: String },
    status: {
      type: String,
      enum: ['In Review', 'Interview', 'Applied', 'Reviewed', 'Shortlisted', 'Rejected', 'Hired'],
      default: 'Applied',
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const Application = model<TApplication>('Application', applicationSchema);
