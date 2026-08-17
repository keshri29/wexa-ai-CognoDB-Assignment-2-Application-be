import * as graphRepository from '../repositories/graphRepository';
import { AppError } from '../utils/AppError';
import { GraphPath } from '../types';

export async function findPath(from: string, to: string): Promise<GraphPath> {
  if (from === to) {
    throw AppError.badRequest('"from" and "to" must be different developers');
  }

  const { fromExists, toExists } = await graphRepository.checkUsersExist(from, to);
  if (!fromExists) throw AppError.notFound(`No developer found with id "${from}"`);
  if (!toExists) throw AppError.notFound(`No developer found with id "${to}"`);

  return graphRepository.findShortestPath(from, to);
}

export async function getStats() {
  return graphRepository.getGraphStats();
}
