import { Request, Response } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middleware/asyncHandler';
import * as userService from '../services/userService';
import { AppError } from '../utils/AppError';

const listUsersQuery = z.object({
  skill: z.string().trim().min(1).optional(),
  search: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(50).optional(),
});

export const listUsers = asyncHandler(async (req: Request, res: Response) => {
  const parsed = listUsersQuery.safeParse(req.query);
  if (!parsed.success) {
    throw AppError.badRequest(parsed.error.issues[0]?.message ?? 'Invalid query parameters');
  }

  const result = await userService.listUsers(parsed.data);
  res.json(result);
});

export const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const profile = await userService.getUserProfile(req.params.id);
  res.json(profile);
});

const recommendationsQuery = z.object({
  limit: z.coerce.number().int().positive().max(25).optional(),
});

export const getRecommendations = asyncHandler(async (req: Request, res: Response) => {
  const parsed = recommendationsQuery.safeParse(req.query);
  if (!parsed.success) {
    throw AppError.badRequest(parsed.error.issues[0]?.message ?? 'Invalid query parameters');
  }

  const recommendations = await userService.getRecommendations(req.params.id, parsed.data.limit);
  res.json({ recommendations });
});
