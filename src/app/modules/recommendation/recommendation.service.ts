import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Resume } from '../resume/resume.model';
import { User } from '../user/user.model';
import { Job } from '../job/job.model';
import { generateGroqResponse } from '../ai/groq';
import { generateAIResponse } from '../ai/gemini';

const getRecommendations = async (userEmail: string) => {
  const user = await User.findOne({ email: userEmail });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  const resume = await Resume.findOne({ userId: user._id, isDeleted: false });
  if (!resume || !resume.parsedData) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Please upload and parse your resume first to get recommendations.');
  }

  // Find active jobs
  const jobs = await Job.find({ status: 'Active', isDeleted: false }).limit(20);
  
  if (jobs.length === 0) {
    return { recommendedJobs: [], recommendedSkills: [] };
  }

  // Ask AI to find matches and skill gaps
  const prompt = `
  User Technical Skills: ${resume.parsedData.technicalSkills.join(', ')}
  User Soft Skills: ${resume.parsedData.softSkills?.join(', ') || 'N/A'}
  User Experience: ${resume.parsedData.experienceSummary}

  Available Jobs (JSON):
  ${JSON.stringify(jobs.map(j => ({ id: j._id, title: j.title, category: j.category, location: j.location, reqs: j.shortDescription })))}

  Based on the user's skills and the available jobs, please return a JSON object containing:
  1. "recommendedJobs": Array of objects { jobId, matchPercentage (number 0-100), reason (string) }
  2. "recommendedSkills": Array of objects { name (string), importance ('High'|'Medium'|'Low'), reason (string) }
  
  Return ONLY valid JSON. No markdown ticks.
  `;

  try {
    let aiResponse = '';
    try {
      // Primary: Groq with Llama 3.3 70B Versatile for high speed and accuracy
      aiResponse = await generateGroqResponse(
        prompt,
        'You are an expert AI Job Matchmaker and Career Coach. Return only valid JSON.',
        'llama-3.3-70b-versatile',
        true
      );
    } catch (groqErr) {
      console.warn('Groq recommendation failed, falling back to Gemini:', groqErr);
      aiResponse = await generateAIResponse(prompt, 'You are an AI Matchmaker. Return only valid JSON.');
    }
    
    if (!aiResponse) {
      throw new Error("Failed to get a valid response from AI");
    }

    const match = aiResponse.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (!match) throw new Error("No JSON found in AI response");
    const recommendations = JSON.parse(match[0]);

    // Populate job details for frontend rendering
    const rawJobs = Array.isArray(recommendations.recommendedJobs) ? recommendations.recommendedJobs : [];
    const populatedJobs = rawJobs.map((rec: any) => {
      const foundJob = jobs.find(j => j._id.toString() === rec.jobId?.toString());
      return {
        jobId: rec.jobId,
        matchPercentage: typeof rec.matchPercentage === 'number' ? rec.matchPercentage : 80,
        reason: rec.reason || 'Strong skill alignment with job requirements.',
        jobDetails: foundJob ? {
          _id: foundJob._id,
          title: foundJob.title,
          category: foundJob.category,
          location: foundJob.location,
          jobType: foundJob.jobType,
          workMode: foundJob.workMode,
          salaryRange: foundJob.salaryRange,
          shortDescription: foundJob.shortDescription,
        } : null,
      };
    });

    return {
      recommendedJobs: populatedJobs,
      recommendedSkills: Array.isArray(recommendations.recommendedSkills) ? recommendations.recommendedSkills : [],
    };
  } catch (error: any) {
    console.error("Recommendation Error:", error);
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to generate recommendations');
  }
};

export const RecommendationServices = {
  getRecommendations,
};
