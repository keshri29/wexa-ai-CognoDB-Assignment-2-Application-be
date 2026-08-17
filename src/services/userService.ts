import * as userRepository from '../repositories/userRepository';
import { AppError } from '../utils/AppError';

export interface ListUsersOptions {
  skill?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export async function listUsers(options: ListUsersOptions) {
  const page = Math.max(1, options.page ?? 1);
  const limit = Math.min(50, Math.max(1, options.limit ?? 20));
  const skip = (page - 1) * limit;

  const { users, total } = await userRepository.searchUsers({
    skill: options.skill,
    search: options.search,
    skip,
    limit,
  });

  return {
    users,
    pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
  };
}

export async function getUserProfile(id: string) {
  const profile = await userRepository.getUserProfile(id);
  if (!profile) {
    throw AppError.notFound(`No developer found with id "${id}"`);
  }
  return profile;
}

export async function getRecommendations(id: string, limit = 10) {
  // Confirms the user exists before recommending, so a bad id gives a clear 404
  // instead of a silent empty recommendation list.
  await getUserProfile(id);
  return userRepository.getRecommendations(id, Math.min(25, Math.max(1, limit)));
}
