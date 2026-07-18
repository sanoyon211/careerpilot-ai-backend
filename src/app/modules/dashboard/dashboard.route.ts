import express from 'express';
import { DashboardControllers } from './dashboard.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get(
  '/job-seeker-stats',
  auth('job-seeker'),
  DashboardControllers.getJobSeekerStats,
);

router.get(
  '/employer-stats',
  auth('employer', 'admin'),
  DashboardControllers.getEmployerStats,
);

export const DashboardRoutes = router;
