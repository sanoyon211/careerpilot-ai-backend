import { z } from 'zod';

const createResumeValidationSchema = z.object({
  body: z.object({
    fileUrl: z.string({ message: 'File URL is required' }),
  }),
});

export const ResumeValidations = {
  createResumeValidationSchema,
};
