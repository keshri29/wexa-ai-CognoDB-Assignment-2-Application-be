import { Request, Response } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middleware/asyncHandler';
import * as skillService from '../services/skillService';
import { AppError } from '../utils/AppError';

export const listSkills = asyncHandler(async (_req: Request, res: Response) => {
  const skills = await skillService.listSkills();
  res.json({ skills });
});

const relatedQuery = z.object({
  limit: z.coerce.number().int().positive().max(25).optional(),
});

export const getRelatedSkills = asyncHandler(async (req: Request, res: Response) => {
  const parsed = relatedQuery.safeParse(req.query);
  if (!parsed.success) {
    throw AppError.badRequest(parsed.error.issues[0]?.message ?? 'Invalid query parameters');
  }

  const related = await skillService.getRelatedSkills(req.params.id, parsed.data.limit);
  res.json({ related });
});

export const getSkillDetail = asyncHandler(async (req: Request, res: Response) => {
  const detail = await skillService.getSkillDetail(req.params.id);
  res.json(detail);
});
