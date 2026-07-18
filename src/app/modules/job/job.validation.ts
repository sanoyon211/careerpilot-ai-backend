import { z } from 'zod';

const createJobValidationSchema = z.object({
  body: z.object({
    title: z.string({ message: 'Title is required' }),
    category: z.string({ message: 'Category is required' }),
    shortDescription: z.string({ message: 'Short description is required' }),
    fullDescription: z.string({ message: 'Full description is required' }),
    location: z.string({ message: 'Location is required' }),
    workMode: z.enum(['Remote', 'Hybrid', 'On-site']),
    jobType: z.enum(['Full-time', 'Part-time', 'Contract', 'Internship']),
    salaryRange: z.string().optional(),
    imageUrl: z.string().optional(),
    status: z.enum(['Active', 'Draft', 'Closed']).optional(),
  }),
});

const updateJobValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    category: z.string().optional(),
    shortDescription: z.string().optional(),
    fullDescription: z.string().optional(),
    location: z.string().optional(),
    workMode: z.enum(['Remote', 'Hybrid', 'On-site']).optional(),
    jobType: z.enum(['Full-time', 'Part-time', 'Contract', 'Internship']).optional(),
    salaryRange: z.string().optional(),
    imageUrl: z.string().optional(),
    status: z.enum(['Active', 'Draft', 'Closed']).optional(),
  }),
});

export const JobValidations = {
  createJobValidationSchema,
  updateJobValidationSchema,
};
