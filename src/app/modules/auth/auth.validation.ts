import { z } from 'zod';

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({ message: 'Email is required' }).email(),
    password: z.string({ message: 'Password is required' }),
  }),
});

const socialLoginValidationSchema = z.object({
  body: z.object({
    email: z.string({ message: 'Email is required' }).email(),
    name: z.string({ message: 'Name is required' }),
    photoURL: z.string().optional(),
  }),
});

export const AuthValidations = {
  loginValidationSchema,
  socialLoginValidationSchema,
};
