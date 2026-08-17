import { Request, Response } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middleware/asyncHandler';
import * as graphService from '../services/graphService';
import { AppError } from '../utils/AppError';

const pathQuery = z.object({
  from: z.string().trim().min(1, 'Query parameter "from" is required'),
  to: z.string().trim().min(1, 'Query parameter "to" is required'),
});

export const getPath = asyncHandler(async (req: Request, res: Response) => {
  const parsed = pathQuery.safeParse(req.query);
  if (!parsed.success) {
    throw AppError.badRequest(parsed.error.issues[0]?.message ?? 'Invalid query parameters');
  }

  const path = await graphService.findPath(parsed.data.from, parsed.data.to);
  res.json(path);
});

export const getStats = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await graphService.getStats();
  res.json(stats);
});
