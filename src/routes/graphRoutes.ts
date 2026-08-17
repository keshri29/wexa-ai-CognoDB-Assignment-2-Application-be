import { Router } from 'express';
import { getPath, getStats } from '../controllers/graphController';

export const graphRoutes = Router();

graphRoutes.get('/path', getPath);
graphRoutes.get('/stats', getStats);
