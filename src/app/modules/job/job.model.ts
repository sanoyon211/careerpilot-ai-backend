import { Schema, model } from 'mongoose';
import { TJob } from './job.interface';

const jobSchema = new Schema<TJob>(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    location: { type: String, required: true },
    workMode: { type: String, enum: ['Remote', 'Hybrid', 'On-site'], required: true },
    jobType: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Internship'], required: true },
    salaryRange: { type: String },
    imageUrl: { type: String },
    employerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['Active', 'Draft', 'Closed'], default: 'Active' },
    applicantsCount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const Job = model<TJob>('Job', jobSchema);
