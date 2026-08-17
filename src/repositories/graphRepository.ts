import { Path as Neo4jPath } from 'neo4j-driver';
import { withSession } from '../config/database';
import { FIND_SHORTEST_PATH, GRAPH_STATS, USERS_EXIST } from '../queries/graphQueries';
import { GraphPath, GraphStats } from '../types';
import { mapPath, toNumber } from '../utils/mappers';

export async function checkUsersExist(from: string, to: string): Promise<{ fromExists: boolean; toExists: boolean }> {
  return withSession(async session => {
    const result = await session.run(USERS_EXIST, { from, to });
    const record = result.records[0];
    return {
      fromExists: Boolean(record?.get('fromExists')),
      toExists: Boolean(record?.get('toExists')),
    };
  });
}

export async function findShortestPath(from: string, to: string): Promise<GraphPath> {
  return withSession(async session => {
    const result = await session.run(FIND_SHORTEST_PATH, { from, to });
    const record = result.records[0];

    if (!record) {
      return { found: false, length: 0, nodes: [], relationships: [] };
    }

    const path = record.get('path') as Neo4jPath;
    const { nodes, relationships } = mapPath(path);
    return { found: true, length: relationships.length, nodes, relationships };
  });
}

export async function getGraphStats(): Promise<GraphStats> {
  return withSession(async session => {
    const result = await session.run(GRAPH_STATS);
    const record = result.records[0];
    return {
      users: toNumber(record?.get('users') ?? 0),
      skills: toNumber(record?.get('skills') ?? 0),
      projects: toNumber(record?.get('projects') ?? 0),
      relationships: toNumber(record?.get('relationships') ?? 0),
    };
  });
}
