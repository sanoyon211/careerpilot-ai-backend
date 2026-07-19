import { GoogleGenAI } from '@google/genai';
import config from '../../config';

const ai = new GoogleGenAI({ apiKey: config.ai.gemini_api_key as string });

export const generateAIResponse = async (prompt: string, systemInstruction?: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-flash-latest',
    contents: prompt,
    config: {
      ...(systemInstruction !== undefined && { systemInstruction }),
      temperature: 0.7,
    },
  });
  
  return response.text;
};

export const generateAIChatResponse = async (history: { role: 'user' | 'model'; parts: { text: string }[] }[], systemInstruction?: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-flash-latest',
    contents: history,
    config: {
      ...(systemInstruction !== undefined && { systemInstruction }),
      temperature: 0.7,
    },
  });
  
  return response.text;
};

export const generateAIResponseWithPDF = async (prompt: string, pdfBuffer: Buffer, mimeType = 'application/pdf') => {
  const response = await ai.models.generateContent({
    model: 'gemini-flash-latest',
    contents: [
      {
        inlineData: {
          data: pdfBuffer.toString('base64'),
          mimeType,
        }
      },
      { text: prompt }
    ],
    config: {
      responseMimeType: 'application/json',
    }
  });
  
  return response.text;
};
