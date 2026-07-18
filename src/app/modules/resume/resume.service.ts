import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Resume } from './resume.model';
import { User } from '../user/user.model';
import { generateAIResponseWithPDF } from '../ai/gemini';
import { RESUME_PARSER_PROMPT } from '../ai/prompts';

const processAndSaveResume = async (fileUrl: string, userEmail: string) => {
  const user = await User.findOne({ email: userEmail });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  // 1. Fetch PDF buffer from Cloudinary URL
  let pdfBuffer: Buffer;
  try {
    const response = await fetch(fileUrl);
    const arrayBuffer = await response.arrayBuffer();
    pdfBuffer = Buffer.from(arrayBuffer);
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to fetch the uploaded file from Cloudinary');
  }

  // 2. Parse using Gemini
  let parsedData = { technicalSkills: [], softSkills: [], experienceSummary: '' };
  try {
    const aiResponse = await generateAIResponseWithPDF(RESUME_PARSER_PROMPT, pdfBuffer);
    
    if (!aiResponse) {
      throw new Error("Failed to get a valid response from AI");
    }

    // Clean response (sometimes AI wraps in ```json ... ```)
    const match = aiResponse.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (!match) throw new Error("No JSON found in AI response");
    parsedData = JSON.parse(match[0]);
  } catch (error) {
    console.error("AI Parsing Error:", error);
    // Proceed with empty defaults if AI fails so the user isn't blocked completely
  }

  // 3. Save to DB (Upsert)
  const result = await Resume.findOneAndUpdate(
    { userId: user._id },
    { fileUrl, parsedData, isDeleted: false },
    { new: true, upsert: true }
  );

  return result;
};

const getMyResumeFromDB = async (userEmail: string) => {
  const user = await User.findOne({ email: userEmail });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  const result = await Resume.findOne({ userId: user._id, isDeleted: false });
  return result;
};

export const ResumeServices = {
  processAndSaveResume,
  getMyResumeFromDB,
};
