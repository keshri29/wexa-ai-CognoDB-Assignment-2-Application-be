import neo4j, { Node as Neo4jNode } from 'neo4j-driver';
import { withSession } from '../config/database';
import { COUNT_USERS, GET_RECOMMENDATIONS, GET_USER_PROFILE, SEARCH_USERS } from '../queries/userQueries';
import { Recommendation, UserProfile, UserSummary } from '../types';
import { mapProject, mapSkill, mapUser, mapUserSlim, toNumber } from '../utils/mappers';

export interface SearchUsersParams {
  skill?: string;
  search?: string;
  skip: number;
  limit: number;
}

export async function searchUsers(params: SearchUsersParams): Promise<{ users: UserSummary[]; total: number }> {
  const queryParams = {
    skill: params.skill ?? null,
    search: params.search ?? null,
    skip: neo4j.int(params.skip),
    limit: neo4j.int(params.limit),
  };

  // Two independent sessions, not one shared session: a driver session can only
  // have one query in flight at a time, so running both concurrently on the same
  // session throws "Queries cannot be run directly on a session with an open transaction".
  const [usersResult, countResult] = await Promise.all([
    withSession(session => session.run(SEARCH_USERS, queryParams)),
    withSession(session => session.run(COUNT_USERS, { skill: queryParams.skill, search: queryParams.search })),
  ]);

  const users: UserSummary[] = usersResult.records.map(record => {
    const userNode = record.get('u') as Neo4jNode;
    const topSkillNodes = record.get('topSkills') as Neo4jNode[];
    return {
      ...mapUser(userNode),
      topSkills: topSkillNodes.map(mapSkill),
      projectCount: toNumber(record.get('projectCount')),
    };
  });

  return { users, total: toNumber(countResult.records[0]?.get('total') ?? 0) };
}

export async function getUserProfile(id: string): Promise<UserProfile | null> {
  return withSession(async session => {
    const result = await session.run(GET_USER_PROFILE, { id });
    const record = result.records[0];
    if (!record || record.get('u') === null) return null;

    return {
      ...mapUser(record.get('u') as Neo4jNode),
      skills: (record.get('skills') as Neo4jNode[]).map(mapSkill),
      projects: (record.get('projects') as Neo4jNode[]).map(mapProject),
      followers: (record.get('followers') as Neo4jNode[]).map(mapUserSlim),
      following: (record.get('following') as Neo4jNode[]).map(mapUserSlim),
    };
  });
}

export async function getRecommendations(userId: string, limit: number): Promise<Recommendation[]> {
  return withSession(async session => {
    const result = await session.run(GET_RECOMMENDATIONS, { userId, limit: neo4j.int(limit) });
    return result.records.map(record => ({
      user: mapUser(record.get('candidate') as Neo4jNode),
      matchedSkills: (record.get('matchedSkills') as Neo4jNode[]).map(mapSkill),
      sharedSkills: toNumber(record.get('sharedSkills')),
      sharedProjects: toNumber(record.get('sharedProjects')),
      score: toNumber(record.get('score')),
    }));
  });
}
