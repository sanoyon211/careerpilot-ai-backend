import { z } from 'zod';

const createResumeValidationSchema = z.object({
  body: z.object({
    fileUrl: z.string({ message: 'File URL is required' }),
    fileName: z.string().optional(),
  }),
});

export const ResumeValidations = {
  createResumeValidationSchema,
};
