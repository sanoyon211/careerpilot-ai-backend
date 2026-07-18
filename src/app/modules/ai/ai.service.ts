import { generateAIResponse } from './gemini';
import { COVER_LETTER_PROMPT } from './prompts';

const generateCoverLetter = async (payload: { jobDescription: string; resumeData: any }) => {
  const { jobDescription, resumeData } = payload;
  
  const prompt = `
    Job Description:
    ${jobDescription}
    
    My Resume Data:
    ${JSON.stringify(resumeData)}
  `;

  const coverLetter = await generateAIResponse(prompt, COVER_LETTER_PROMPT);
  
  return coverLetter;
};

export const AIServices = {
  generateCoverLetter,
};