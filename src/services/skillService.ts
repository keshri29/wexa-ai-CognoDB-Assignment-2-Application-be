import * as skillRepository from '../repositories/skillRepository';
import { AppError } from '../utils/AppError';

export async function listSkills() {
  return skillRepository.listSkills();
}

export async function getSkillDetail(id: string, relatedLimit = 8) {
  const skill = await skillRepository.getSkillById(id);
  if (!skill) {
    throw AppError.notFound(`No skill found with id "${id}"`);
  }

  const [developers, projects, relatedSkills] = await Promise.all([
    skillRepository.getSkillUsers(id),
    skillRepository.getSkillProjects(id),
    skillRepository.getRelatedSkills(id, relatedLimit),
  ]);

  return { skill, developers, projects, relatedSkills };
}

export async function getRelatedSkills(id: string, limit = 8) {
  const skill = await skillRepository.getSkillById(id);
  if (!skill) {
    throw AppError.notFound(`No skill found with id "${id}"`);
  }
  return skillRepository.getRelatedSkills(id, limit);
}
