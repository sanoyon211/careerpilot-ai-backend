import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { UserRoutes } from '../modules/user/user.route';
import { UploadRoutes } from '../modules/upload/upload.route';
import { JobRoutes } from '../modules/job/job.route';
import { ApplicationRoutes } from '../modules/application/application.route';
import { ResumeRoutes } from '../modules/resume/resume.route';
import { ChatRoutes } from '../modules/chat/chat.route';
import { RecommendationRoutes } from '../modules/recommendation/recommendation.route';

const router = Router();

const moduleRoutes = [
  { path: '/auth', route: AuthRoutes },
  { path: '/users', route: UserRoutes },
  { path: '/upload', route: UploadRoutes },
  { path: '/jobs', route: JobRoutes },
  { path: '/applications', route: ApplicationRoutes },
  { path: '/resume', route: ResumeRoutes },
  { path: '/chat', route: ChatRoutes },
  { path: '/recommendations', route: RecommendationRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
