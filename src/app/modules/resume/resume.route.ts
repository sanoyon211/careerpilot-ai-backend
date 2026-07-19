import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ResumeValidations } from './resume.validation';
import { ResumeControllers } from './resume.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/',
  auth('job-seeker'),
  validateRequest(ResumeValidations.createResumeValidationSchema),
  ResumeControllers.uploadAndParseResume,
);

router.get(
  '/me',
  auth('job-seeker'),
  ResumeControllers.getMyResume,
);

router.delete(
  '/me',
  auth('job-seeker'),
  ResumeControllers.deleteMyResume,
);

export const ResumeRoutes = router;
