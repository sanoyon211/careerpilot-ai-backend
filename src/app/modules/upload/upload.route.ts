import express from 'express';
import { upload } from '../../utils/uploadImage';
import { UploadControllers } from './upload.controller';

const router = express.Router();

router.post('/', upload.single('file'), UploadControllers.uploadFile);

export const UploadRoutes = router;
