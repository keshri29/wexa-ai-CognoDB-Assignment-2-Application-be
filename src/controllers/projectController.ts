import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import * as projectService from '../services/projectService';

export const listProjects = asyncHandler(async (_req: Request, res: Response) => {
  const projects = await projectService.listProjects();
  res.json({ projects });
});

export const getProjectDetail = asyncHandler(async (req: Request, res: Response) => {
  const project = await projectService.getProjectDetail(req.params.id);
  res.json(project);
});
