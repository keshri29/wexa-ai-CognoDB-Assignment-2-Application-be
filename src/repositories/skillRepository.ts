import neo4j, { Node as Neo4jNode } from 'neo4j-driver';
import { withSession } from '../config/database';
import {
  GET_RELATED_SKILLS,
  GET_SKILL,
  GET_SKILL_PROJECTS,
  GET_SKILL_USERS,
  LIST_SKILLS,
} from '../queries/skillQueries';
import { RelatedSkill, Skill } from '../types';
import { mapProject, mapSkill, mapUser, toNumber } from '../utils/mappers';
import { Project, User } from '../types';

export async function listSkills(): Promise<(Skill & { userCount: number })[]> {
  return withSession(async session => {
    const result = await session.run(LIST_SKILLS);
    return result.records.map(record => ({
      ...mapSkill(record.get('s') as Neo4jNode),
      userCount: toNumber(record.get('userCount')),
    }));
  });
}

export async function getSkillById(id: string): Promise<Skill | null> {
  return withSession(async session => {
    const result = await session.run(GET_SKILL, { id });
    const node = result.records[0]?.get('s') as Neo4jNode | undefined;
    return node ? mapSkill(node) : null;
  });
}

export async function getSkillUsers(id: string): Promise<User[]> {
  return withSession(async session => {
    const result = await session.run(GET_SKILL_USERS, { id });
    return result.records.map(record => mapUser(record.get('u') as Neo4jNode));
  });
}

export async function getSkillProjects(id: string): Promise<Project[]> {
  return withSession(async session => {
    const result = await session.run(GET_SKILL_PROJECTS, { id });
    return result.records.map(record => mapProject(record.get('p') as Neo4jNode));
  });
}

export async function getRelatedSkills(id: string, limit: number): Promise<RelatedSkill[]> {
  return withSession(async session => {
    const result = await session.run(GET_RELATED_SKILLS, { id, limit: neo4j.int(limit) });
    return result.records.map(record => ({
      skill: mapSkill(record.get('related') as Neo4jNode),
      sharedProjects: toNumber(record.get('sharedProjects')),
    }));
  });
}
