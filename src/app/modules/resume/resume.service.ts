import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Resume } from './resume.model';
import { User } from '../user/user.model';
import { generateAIResponseWithPDF } from '../ai/gemini';
import { RESUME_PARSER_PROMPT } from '../ai/prompts';

const processAndSaveResume = async (fileUrl: string, fileName: string, userEmail: string) => {
  const user = await User.findOne({ email: userEmail });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  // 1. Fetch PDF buffer from Cloudinary URL
  let pdfBuffer: Buffer;
  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Cloudinary responded with status: ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    pdfBuffer = Buffer.from(arrayBuffer);
    console.log(`[Resume Upload] Fetched file size: ${pdfBuffer.byteLength} bytes. FileUrl: ${fileUrl}`);
  } catch (error: any) {
    console.error('[Resume Upload] Error fetching file:', error);
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to fetch the uploaded file from Cloudinary: ' + error.message);
  }

  // 2. Parse using Gemini
  let parsedData = { technicalSkills: [], softSkills: [], experienceSummary: '' };
  try {
    let mimeType = 'application/pdf';
    const checkName = (fileName || fileUrl || '').toLowerCase();
    
    if (checkName.endsWith('.docx') || checkName.includes('.docx')) {
      mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    } else if (checkName.endsWith('.doc') || checkName.includes('.doc')) {
      mimeType = 'application/msword';
    }
    
    const aiResponse = await generateAIResponseWithPDF(RESUME_PARSER_PROMPT, pdfBuffer, mimeType);
    
    if (!aiResponse) {
      throw new Error("Failed to get a valid response from AI");
    }

    // Clean response (sometimes AI wraps in ```json ... ```)
    const match = aiResponse.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (!match) throw new Error("No JSON found in AI response");
    parsedData = JSON.parse(match[0]);
  } catch (error: any) {
    console.error("AI Parsing Error:", error?.message || error);
    throw new AppError(httpStatus.SERVICE_UNAVAILABLE, 'Failed to parse resume using AI: ' + (error.message || 'Unknown error'));
  }

  // 3. Save to DB (Upsert)
  const result = await Resume.findOneAndUpdate(
    { userId: user._id },
    { fileUrl, fileName, parsedData, isDeleted: false },
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

const deleteMyResumeFromDB = async (userEmail: string) => {
  const user = await User.findOne({ email: userEmail });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  const result = await Resume.findOneAndUpdate(
    { userId: user._id, isDeleted: false },
    { isDeleted: true },
    { new: true },
  );
  if (!result) throw new AppError(httpStatus.NOT_FOUND, 'Resume not found');
  return result;
};

export const ResumeServices = {
  processAndSaveResume,
  getMyResumeFromDB,
  deleteMyResumeFromDB,
};
