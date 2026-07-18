import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinaryUpload } from '../config/cloudinary';

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: {
    folder: 'careerpilot-ai',
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'],
  } as any,
});

export const upload = multer({ storage });
