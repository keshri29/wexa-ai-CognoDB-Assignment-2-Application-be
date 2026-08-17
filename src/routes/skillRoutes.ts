import { Router } from 'express';
import { getRelatedSkills, getSkillDetail, listSkills } from '../controllers/skillController';

export const skillRoutes = Router();

skillRoutes.get('/', listSkills);
skillRoutes.get('/:id/related', getRelatedSkills);
skillRoutes.get('/:id', getSkillDetail);
