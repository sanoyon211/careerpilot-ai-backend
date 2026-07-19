import { Schema, model } from 'mongoose';
import { TResume } from './resume.interface';

const resumeSchema = new Schema<TResume>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    fileUrl: { type: String, required: true },
    fileName: { type: String },
    parsedData: {
      technicalSkills: [{ type: String }],
      softSkills: [{ type: String }],
      experienceSummary: { type: String },
      atsScore: { type: Number },
      atsFeedback: [{ type: String }],
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const Resume = model<TResume>('Resume', resumeSchema);
