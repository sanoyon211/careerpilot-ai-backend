import { z } from 'zod';

const createApplicationValidationSchema = z.object({
  body: z.object({
    jobId: z.string({ message: 'Job ID is required' }),
    resumeUrl: z.string({ message: 'Resume URL is required' }),
    applicantName: z.string().optional(),
    applicantEmail: z.string().optional(),
    applicantPhone: z.string().optional(),
    coverLetter: z.string().optional(),
  }),
});

const updateApplicationStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(['In Review', 'Interview', 'Applied', 'Reviewed', 'Shortlisted', 'Rejected', 'Hired']),
  }),
});

export const ApplicationValidations = {
  createApplicationValidationSchema,
  updateApplicationStatusValidationSchema,
};
