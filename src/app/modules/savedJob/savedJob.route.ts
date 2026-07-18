import express from 'express';
import { SavedJobControllers } from './savedJob.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/',
  auth('job-seeker'),
  SavedJobControllers.saveJob,
);

router.get(
  '/',
  auth('job-seeker'),
  SavedJobControllers.getMySavedJobs,
);

router.delete(
  '/:id',
  auth('job-seeker'),
  SavedJobControllers.removeSavedJob,
);

export const SavedJobRoutes = router;
