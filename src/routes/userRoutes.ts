import { Router } from 'express';
import { getRecommendations, getUserProfile, listUsers } from '../controllers/userController';

export const userRoutes = Router();

userRoutes.get('/', listUsers);
userRoutes.get('/:id', getUserProfile);
userRoutes.get('/:id/recommendations', getRecommendations);
