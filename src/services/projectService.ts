import * as projectRepository from '../repositories/projectRepository';
import { AppError } from '../utils/AppError';

export async function listProjects() {
  return projectRepository.listProjects();
}

export async function getProjectDetail(id: string) {
  const project = await projectRepository.getProjectDetail(id);
  if (!project) {
    throw AppError.notFound(`No project found with id "${id}"`);
  }
  return project;
}
