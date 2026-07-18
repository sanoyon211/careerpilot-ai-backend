import express from 'express';
import { ChatControllers } from './chat.controller';
import auth from '../../middlewares/auth';
import { z } from 'zod';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

const chatValidationSchema = z.object({
  body: z.object({
    message: z.string({ required_error: 'Message is required' }),
  })
});

router.post(
  '/',
  auth('job-seeker'),
  validateRequest(chatValidationSchema),
  ChatControllers.sendMessage,
);

export const ChatRoutes = router;
