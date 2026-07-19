import express from 'express';
import auth from '../../middlewares/auth';
import { AIControllers } from './ai.controller';
import validateRequest from '../../middlewares/validateRequest';
import { z } from 'zod';

const router = express.Router();

const coverLetterValidationSchema = z.object({
  body: z.object({
    jobDescription: z.string({ message: 'Job description is required' }).min(10, 'Job description must be at least 10 characters'),
    resumeData: z.any(),
  }),
});

router.post(
  '/generate-cover-letter',
  auth('job-seeker'),
  validateRequest(coverLetterValidationSchema),
  AIControllers.generateCoverLetter,
);

export const AIRoutes = router;