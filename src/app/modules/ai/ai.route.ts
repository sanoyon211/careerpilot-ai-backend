import express from 'express';
import auth from '../../middlewares/auth';
import { AIControllers } from './ai.controller';

const router = express.Router();

router.post(
  '/generate-cover-letter',
  auth('job-seeker'),
  AIControllers.generateCoverLetter,
);

export const AIRoutes = router;