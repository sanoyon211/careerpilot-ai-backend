import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ApplicationValidations } from './application.validation';
import { ApplicationControllers } from './application.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/',
  auth('job-seeker'),
  validateRequest(ApplicationValidations.createApplicationValidationSchema),
  ApplicationControllers.createApplication,
);

router.get(
  '/my-applications',
  auth('job-seeker'),
  ApplicationControllers.getMyApplications,
);

router.get(
  '/job/:jobId',
  auth('employer', 'admin'),
  ApplicationControllers.getJobApplications,
);

router.patch(
  '/:id/status',
  auth('employer', 'admin'),
  validateRequest(ApplicationValidations.updateApplicationStatusValidationSchema),
  ApplicationControllers.updateApplicationStatus,
);

router.delete(
  '/:id',
  auth('employer', 'admin'),
  ApplicationControllers.deleteApplication,
);

export const ApplicationRoutes = router;
