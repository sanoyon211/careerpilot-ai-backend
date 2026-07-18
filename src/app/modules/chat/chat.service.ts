import { generateAIResponse } from '../ai/gemini';
import { CAREER_COACH_SYSTEM_PROMPT } from '../ai/prompts';
import { Resume } from '../resume/resume.model';
import { User } from '../user/user.model';

const processChatMessage = async (message: string, userEmail: string) => {
  // Inject context if user has a resume
  const user = await User.findOne({ email: userEmail });
  let context = '';
  
  if (user) {
    const resume = await Resume.findOne({ userId: user._id, isDeleted: false });
    if (resume) {
      context = `User Context: They have the following technical skills: ${resume.parsedData.technicalSkills.join(', ')}. 
      Their experience: ${resume.parsedData.experienceSummary}. 
      Use this context to give personalized advice if relevant to their question.\n\n`;
    }
  }

  const prompt = `${context}User Question: ${message}`;
  
  const aiReply = await generateAIResponse(prompt, CAREER_COACH_SYSTEM_PROMPT);
  
  return {
    reply: aiReply
  };
};

export const ChatServices = {
  processChatMessage,
};
