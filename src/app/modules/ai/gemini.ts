import { GoogleGenAI } from '@google/genai';
import config from '../../config';

const ai = new GoogleGenAI({ apiKey: config.ai.gemini_api_key });

export const generateAIResponse = async (prompt: string, systemInstruction?: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.7,
    },
  });
  
  return response.text;
};

export const generateAIResponseWithPDF = async (prompt: string, pdfBuffer: Buffer, mimeType = 'application/pdf') => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
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
