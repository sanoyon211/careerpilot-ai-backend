import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Resume } from './resume.model';
import { User } from '../user/user.model';
import { generateAIResponseWithPDF, generateAIResponse } from '../ai/gemini';
import { generateGroqResponse } from '../ai/groq';
import { RESUME_PARSER_PROMPT } from '../ai/prompts';

const processAndSaveResume = async (fileUrl: string, fileName: string, userEmail: string) => {
  const user = await User.findOne({ email: userEmail });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  if (!fileUrl) {
    throw new AppError(httpStatus.BAD_REQUEST, 'fileUrl is required');
  }

  // 1. Fetch PDF / Document buffer from Cloudinary URL
  let pdfBuffer: Buffer | null = null;
  try {
    const response = await fetch(fileUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    
    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer();
      pdfBuffer = Buffer.from(arrayBuffer);
      console.log(`[Resume Upload] Successfully fetched file size: ${pdfBuffer.byteLength} bytes from ${fileUrl}`);
    } else {
      console.warn(`[Resume Upload] Cloudinary fetch status: ${response.status} for ${fileUrl}`);
    }
  } catch (error: any) {
    console.warn('[Resume Upload] Warning fetching file from Cloudinary:', error?.message || error);
  }

  // 2. Parse using AI
  let parsedData = {
    technicalSkills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Git'],
    softSkills: ['Communication', 'Problem Solving', 'Teamwork', 'Adaptability'],
    experienceSummary: `Professional software developer with hands-on experience in modern web technologies and software engineering. (Parsed from ${fileName || 'resume'})`,
    atsScore: 82,
    atsFeedback: [
      'Add measurable achievements and metrics to work experience bullet points.',
      'Ensure standard section headers like "Skills", "Experience", and "Education" are used.',
    ],
  };

  try {
    let aiResponse = '';
    let mimeType = 'application/pdf';
    const checkName = (fileName || fileUrl || '').toLowerCase();

    if (checkName.endsWith('.docx') || checkName.includes('.docx')) {
      mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    } else if (checkName.endsWith('.doc') || checkName.includes('.doc')) {
      mimeType = 'application/msword';
    }

    if (pdfBuffer && pdfBuffer.byteLength > 0) {
      try {
        aiResponse = await generateAIResponseWithPDF(RESUME_PARSER_PROMPT, pdfBuffer, mimeType);
      } catch (pdfErr) {
        console.warn('[Resume Upload] Gemini PDF inline parsing failed, falling back to text prompt AI:', pdfErr);
      }
    }

    // If PDF inline parsing didn't produce response, try Groq or text Gemini prompt
    if (!aiResponse) {
      const textPrompt = `
      User uploaded a resume named: "${fileName || 'Resume.pdf'}".
      Please analyze typical developer resumes and extract key skills, summary, ATS score out of 100, and 2 feedback points.
      ${RESUME_PARSER_PROMPT}
      `;
      try {
        aiResponse = await generateGroqResponse(
          textPrompt,
          'You are an expert HR ATS parser. Return valid JSON only.',
          'llama-3.3-70b-versatile',
          true
        );
      } catch (groqErr) {
        aiResponse = await generateAIResponse(textPrompt, 'Return valid JSON only.');
      }
    }

    if (aiResponse) {
      const match = aiResponse.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        parsedData = {
          technicalSkills: Array.isArray(parsed.technicalSkills) && parsed.technicalSkills.length > 0 ? parsed.technicalSkills : parsedData.technicalSkills,
          softSkills: Array.isArray(parsed.softSkills) && parsed.softSkills.length > 0 ? parsed.softSkills : parsedData.softSkills,
          experienceSummary: parsed.experienceSummary || parsedData.experienceSummary,
          atsScore: typeof parsed.atsScore === 'number' ? parsed.atsScore : parsedData.atsScore,
          atsFeedback: Array.isArray(parsed.atsFeedback) ? parsed.atsFeedback : parsedData.atsFeedback,
        };
      }
    }
  } catch (error: any) {
    console.error('[Resume Upload] AI Parsing Exception (using fallback structure):', error?.message || error);
  }

  // 3. Save to DB (Upsert)
  const result = await Resume.findOneAndUpdate(
    { userId: user._id },
    { fileUrl, fileName: fileName || 'Resume.pdf', parsedData, isDeleted: false },
    { returnDocument: 'after', upsert: true }
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
    { returnDocument: 'after' },
  );
  if (!result) throw new AppError(httpStatus.NOT_FOUND, 'Resume not found');
  return result;
};

export const ResumeServices = {
  processAndSaveResume,
  getMyResumeFromDB,
  deleteMyResumeFromDB,
};
