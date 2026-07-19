import Groq from 'groq-sdk';
import config from '../../config';

const getGroqClient = () => {
  if (!config.ai.groq_api_key) {
    return null;
  }
  return new Groq({ apiKey: config.ai.groq_api_key });
};

export const generateGroqResponse = async (
  prompt: string,
  systemInstruction?: string,
  model = 'llama-3.3-70b-versatile',
  responseFormatJson = false
) => {
  const groq = getGroqClient();
  if (!groq) {
    throw new Error('Groq API Key is not configured in .env');
  }

  const messages: Groq.Chat.Completions.ChatCompletionMessageParam[] = [];

  if (systemInstruction) {
    messages.push({
      role: 'system',
      content: systemInstruction,
    });
  }

  messages.push({
    role: 'user',
    content: prompt,
  });

  const response = await groq.chat.completions.create({
    messages,
    model,
    temperature: 0.2,
    ...(responseFormatJson ? { response_format: { type: 'json_object' } } : {}),
  });

  return response.choices[0]?.message?.content ?? '';
};

export const generateGroqChatResponse = async (
  history: { role: 'user' | 'assistant' | 'system'; content: string }[],
  systemInstruction?: string,
  model = 'llama-3.3-70b-versatile'
) => {
  const groq = getGroqClient();
  if (!groq) {
    throw new Error('Groq API Key is not configured in .env');
  }

  const messages: Groq.Chat.Completions.ChatCompletionMessageParam[] = [];

  if (systemInstruction) {
    messages.push({
      role: 'system',
      content: systemInstruction,
    });
  }

  history.forEach(msg => {
    messages.push({
      role: msg.role,
      content: msg.content,
    });
  });

  const response = await groq.chat.completions.create({
    messages,
    model,
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content ?? '';
};
