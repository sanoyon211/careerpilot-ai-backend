import { GoogleGenAI } from '@google/genai';
import config from '../../config';

const ai = new GoogleGenAI({ apiKey: config.ai.gemini_api_key as string });

export const generateAIResponse = async (prompt: string, systemInstruction?: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-1.5-flash',
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
    model: 'gemini-1.5-flash',
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
    model: 'gemini-1.5-flash',
    contents: [
      {
        inlineData: {
          data: pdfBuffer.toString('base64'),
          mimeType,
        }
      },
      prompt
    ]
  });
  
  return response.text;
};
