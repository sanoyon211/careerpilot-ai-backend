import { z } from 'zod';

const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string({ message: 'Name is required' }),
    email: z.string({ message: 'Email is required' }).email(),
    password: z
      .string({ message: 'Password is required' })
      .min(6, 'Password must be at least 6 characters'),
    role: z.enum(['job-seeker', 'employer']).optional(),
  }),
});

const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    avatar: z.string().optional(),
    location: z.string().optional(),
    headline: z.string().optional(),
    bio: z.string().optional(),
    portfolio: z.string().url().optional(),
  }),
});

export const UserValidations = {
  createUserValidationSchema,
  updateUserValidationSchema,
};
