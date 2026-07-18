import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TJob } from './job.interface';
import { Job } from './job.model';
import { User } from '../user/user.model';

const createJobIntoDB = async (payload: TJob, employerEmail: string) => {
  const employer = await User.findOne({ email: employerEmail });
  if (!employer) throw new AppError(httpStatus.NOT_FOUND, 'Employer not found');
  
  payload.employerId = employer._id;
  const result = await Job.create(payload);
  return result;
};

import { generateAIResponse } from '../ai/gemini';
import { AGENTIC_SEARCH_PROMPT } from '../ai/prompts';

const getAllJobsFromDB = async (query: Record<string, unknown>) => {
  const filter: any = { isDeleted: false, status: 'Active' };
  
  if (query.agenticSearch === 'true' && query.searchTerm) {
    try {
      const aiResponse = await generateAIResponse(
        `Search Query: "${query.searchTerm}"\n\n${AGENTIC_SEARCH_PROMPT}`
      );
      const match = aiResponse.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        const orConditions = [];
        
        if (parsed.titles && parsed.titles.length > 0) {
          orConditions.push({ title: { $in: parsed.titles.map((t: string) => new RegExp(t, 'i')) } });
        }
        if (parsed.skills && parsed.skills.length > 0) {
          orConditions.push({ fullDescription: { $in: parsed.skills.map((s: string) => new RegExp(s, 'i')) } });
        }
        
        if (orConditions.length > 0) {
          filter.$or = orConditions;
        }
        
        if (parsed.workMode) {
          filter.workMode = parsed.workMode;
        }
      }
    } catch (error) {
      console.error("Agentic Search Error:", error);
      // Fallback to normal search if AI fails
      filter.$or = [
        { title: { $regex: query.searchTerm, $options: 'i' } },
        { category: { $regex: query.searchTerm, $options: 'i' } },
        { location: { $regex: query.searchTerm, $options: 'i' } },
      ];
    }
  } else if (query.searchTerm) {
    filter.$or = [
      { title: { $regex: query.searchTerm, $options: 'i' } },
      { category: { $regex: query.searchTerm, $options: 'i' } },
      { location: { $regex: query.searchTerm, $options: 'i' } },
    ];
  }
  
  if (query.jobType) {
    filter.jobType = query.jobType;
  }
  
  if (query.workMode) {
    filter.workMode = query.workMode;
  }
  
  const result = await Job.find(filter).populate('employerId', 'name avatar');
  return result;
};

const getEmployerJobsFromDB = async (employerEmail: string) => {
  const employer = await User.findOne({ email: employerEmail });
  if (!employer) throw new AppError(httpStatus.NOT_FOUND, 'Employer not found');

  const result = await Job.find({ employerId: employer._id, isDeleted: false });
  return result;
};

const getJobByIdFromDB = async (id: string) => {
  const result = await Job.findById(id).populate('employerId', 'name avatar location');
  if (!result || result.isDeleted) throw new AppError(httpStatus.NOT_FOUND, 'Job not found');
  return result;
};

const deleteJobFromDB = async (id: string, employerEmail: string) => {
  const employer = await User.findOne({ email: employerEmail });
  if (!employer) throw new AppError(httpStatus.NOT_FOUND, 'Employer not found');

  const job = await Job.findById(id);
  if (!job || job.isDeleted) throw new AppError(httpStatus.NOT_FOUND, 'Job not found');

  if (job.employerId.toString() !== employer._id.toString()) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to delete this job');
  }

  const result = await Job.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  return result;
};

export const JobServices = {
  createJobIntoDB,
  getAllJobsFromDB,
  getEmployerJobsFromDB,
  getJobByIdFromDB,
  deleteJobFromDB,
};
