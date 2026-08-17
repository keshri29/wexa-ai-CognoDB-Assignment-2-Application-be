import { Router } from 'express';
import { graphRoutes } from './graphRoutes';
import { healthRoutes } from './healthRoutes';
import { projectRoutes } from './projectRoutes';
import { skillRoutes } from './skillRoutes';
import { userRoutes } from './userRoutes';

export const apiRouter = Router();

apiRouter.use('/health', healthRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/skills', skillRoutes);
apiRouter.use('/projects', projectRoutes);
apiRouter.use('/graph', graphRoutes);
