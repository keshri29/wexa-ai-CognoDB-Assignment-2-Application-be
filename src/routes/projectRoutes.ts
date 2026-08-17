import { Router } from 'express';
import { getProjectDetail, listProjects } from '../controllers/projectController';

export const projectRoutes = Router();

projectRoutes.get('/', listProjects);
projectRoutes.get('/:id', getProjectDetail);
