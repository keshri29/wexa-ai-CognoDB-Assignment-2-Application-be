import { Node as Neo4jNode } from 'neo4j-driver';
import { withSession } from '../config/database';
import { GET_PROJECT_DETAIL, LIST_PROJECTS } from '../queries/projectQueries';
import { Project, ProjectDetail } from '../types';
import { mapProject, mapSkill, mapUserSlim, toNumber } from '../utils/mappers';

export async function listProjects(): Promise<(Project & { developerCount: number })[]> {
  return withSession(async session => {
    const result = await session.run(LIST_PROJECTS);
    return result.records.map(record => ({
      ...mapProject(record.get('p') as Neo4jNode),
      developerCount: toNumber(record.get('developerCount')),
    }));
  });
}

export async function getProjectDetail(id: string): Promise<ProjectDetail | null> {
  return withSession(async session => {
    const result = await session.run(GET_PROJECT_DETAIL, { id });
    const record = result.records[0];
    if (!record || record.get('p') === null) return null;

    return {
      ...mapProject(record.get('p') as Neo4jNode),
      developers: (record.get('developers') as Neo4jNode[]).map(mapUserSlim),
      requiredSkills: (record.get('requiredSkills') as Neo4jNode[]).map(mapSkill),
      relatedProjects: (record.get('relatedProjects') as Neo4jNode[]).map(node => {
        const p = mapProject(node);
        return { id: p.id, name: p.name, category: p.category };
      }),
    };
  });
}
