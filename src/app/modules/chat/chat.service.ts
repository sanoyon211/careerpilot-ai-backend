import { generateAIChatResponse } from '../ai/gemini';
import { CAREER_COACH_SYSTEM_PROMPT, MOCK_INTERVIEW_SYSTEM_PROMPT } from '../ai/prompts';
import { Resume } from '../resume/resume.model';
import { User } from '../user/user.model';

type ChatMessage = { role: 'user' | 'ai'; content: string };

const processChatMessage = async (history: ChatMessage[], userEmail: string, mode?: 'coach' | 'mock-interview') => {
  // Inject context if user has a resume
  const user = await User.findOne({ email: userEmail });
  let context = '';
  
  if (user) {
    const resume = await Resume.findOne({ userId: user._id, isDeleted: false });
    if (resume) {
      context = `\n\nUser Context: They have the following technical skills: ${resume.parsedData.technicalSkills.join(', ')}. 
      Their experience: ${resume.parsedData.experienceSummary}. 
      Use this context to give personalized advice if relevant to their questions.`;
    }
  }

  const basePrompt = mode === 'mock-interview' ? MOCK_INTERVIEW_SYSTEM_PROMPT : CAREER_COACH_SYSTEM_PROMPT;
  const systemInstruction = basePrompt + context;

  const geminiHistory = history.map(msg => ({
    role: (msg.role === 'ai' ? 'model' : 'user') as 'model' | 'user',
    parts: [{ text: msg.content }],
  }));
  
  const aiReply = await generateAIChatResponse(geminiHistory, systemInstruction);
  
  return {
    reply: aiReply
  };
};

export const ChatServices = {
  processChatMessage,
};
