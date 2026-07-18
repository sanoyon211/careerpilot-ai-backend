import { z } from 'zod';

const createResumeValidationSchema = z.object({
  body: z.object({
    fileUrl: z.string({ required_error: 'File URL is required' }),
  }),
});

export const ResumeValidations = {
  createResumeValidationSchema,
};
