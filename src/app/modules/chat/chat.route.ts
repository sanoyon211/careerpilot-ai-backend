import express from 'express';
import { ChatControllers } from './chat.controller';
import auth from '../../middlewares/auth';
import { z } from 'zod';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

const chatValidationSchema = z.object({
  body: z.object({
    history: z.array(z.object({
      role: z.enum(['user', 'ai']),
      content: z.string()
    })),
    mode: z.enum(['coach', 'mock-interview']).optional(),
  })
});

router.post(
  '/',
  auth('job-seeker'),
  validateRequest(chatValidationSchema),
  ChatControllers.sendMessage,
);

export const ChatRoutes = router;
