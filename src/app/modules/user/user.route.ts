import express from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidations } from './user.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/register',
  validateRequest(UserValidations.createUserValidationSchema),
  UserControllers.createUser,
);

router.get(
  '/me',
  auth('job-seeker', 'employer', 'admin'),
  UserControllers.getMyProfile,
);

router.patch(
  '/me',
  auth('job-seeker', 'employer', 'admin'),
  validateRequest(UserValidations.updateUserValidationSchema),
  UserControllers.updateMyProfile,
);

export const UserRoutes = router;
