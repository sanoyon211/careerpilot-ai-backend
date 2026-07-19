import { GoogleGenAI } from '@google/genai';
import config from '../../config';

const ai = new GoogleGenAI({ apiKey: config.ai.gemini_api_key as string });

const GEMINI_MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-flash-latest'];

export const generateAIResponse = async (prompt: string, systemInstruction?: string) => {
  let lastError: any = null;
  for (const model of GEMINI_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          ...(systemInstruction !== undefined && { systemInstruction }),
          temperature: 0.7,
        },
      });
      return response.text ?? '';
    } catch (err: any) {
      console.warn(`[Gemini API] Model ${model} failed, trying fallback:`, err?.message || err);
      lastError = err;
    }
  }
  throw lastError || new Error('All Gemini models failed');
};

export const generateAIChatResponse = async (
  history: { role: 'user' | 'model'; parts: { text: string }[] }[],
  systemInstruction?: string
) => {
  let lastError: any = null;
  for (const model of GEMINI_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: history,
        config: {
          ...(systemInstruction !== undefined && { systemInstruction }),
          temperature: 0.7,
        },
      });
      return response.text ?? '';
    } catch (err: any) {
      console.warn(`[Gemini API Chat] Model ${model} failed, trying fallback:`, err?.message || err);
      lastError = err;
    }
  }
  throw lastError || new Error('All Gemini chat models failed');
};

export const generateAIResponseWithPDF = async (prompt: string, pdfBuffer: Buffer, mimeType = 'application/pdf') => {
  let lastError: any = null;
  for (const model of GEMINI_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: [
          {
            inlineData: {
              data: pdfBuffer.toString('base64'),
              mimeType,
            },
          },
          { text: prompt },
        ],
        config: {
          responseMimeType: 'application/json',
        },
      });
      return response.text ?? '';
    } catch (err: any) {
      console.warn(`[Gemini API PDF] Model ${model} failed, trying fallback:`, err?.message || err);
      lastError = err;
    }
  }
  throw lastError || new Error('All Gemini PDF models failed');
};
