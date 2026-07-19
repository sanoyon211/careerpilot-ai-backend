import express from 'express';
import { upload } from '../../utils/uploadImage';
import { UploadControllers } from './upload.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post('/', auth('job-seeker', 'employer', 'admin'), upload.single('file'), UploadControllers.uploadFile);

export const UploadRoutes = router;
