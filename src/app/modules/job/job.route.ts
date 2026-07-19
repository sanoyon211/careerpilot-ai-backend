import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { JobValidations } from './job.validation';
import { JobControllers } from './job.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/',
  auth('employer', 'admin'),
  validateRequest(JobValidations.createJobValidationSchema),
  JobControllers.createJob,
);

router.get('/', JobControllers.getAllJobs);

router.get(
  '/my-jobs',
  auth('employer', 'admin'),
  JobControllers.getEmployerJobs,
);

router.get('/:id', JobControllers.getJobById);

router.patch(
  '/:id',
  auth('employer', 'admin'),
  JobControllers.updateJob,
);

router.delete(
  '/:id',
  auth('employer', 'admin'),
  JobControllers.deleteJob,
);

export const JobRoutes = router;
