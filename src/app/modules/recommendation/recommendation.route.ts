import express from 'express';
import { RecommendationControllers } from './recommendation.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get(
  '/',
  auth('job-seeker'),
  RecommendationControllers.getRecommendations,
);

export const RecommendationRoutes = router;
