import { generateGroqResponse } from './groq';
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

  try {
    return await generateGroqResponse(prompt, COVER_LETTER_PROMPT, 'llama-3.3-70b-versatile');
  } catch (error) {
    console.warn("Groq cover letter fallback to Gemini:", error);
    return await generateAIResponse(prompt, COVER_LETTER_PROMPT);
  }
};

export const AIServices = {
  generateCoverLetter,
};