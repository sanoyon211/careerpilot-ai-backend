import { z } from 'zod';

const createApplicationValidationSchema = z.object({
  body: z.object({
    jobId: z.string({ required_error: 'Job ID is required' }),
    resumeUrl: z.string({ required_error: 'Resume URL is required' }),
    coverLetter: z.string().optional(),
  }),
});

const updateApplicationStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(['In Review', 'Interview', 'Applied', 'Rejected', 'Hired']),
  }),
});

export const ApplicationValidations = {
  createApplicationValidationSchema,
  updateApplicationStatusValidationSchema,
};
