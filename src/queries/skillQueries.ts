/** Lists all skills with the number of developers who have each one. Params: {} */
export const LIST_SKILLS = `
MATCH (s:Skill)
OPTIONAL MATCH (u:User)-[:HAS_SKILL]->(s)
WITH s, count(DISTINCT u) AS userCount
RETURN s, userCount
ORDER BY userCount DESC, s.name ASC
`;

/** A single skill by id. Params: { id: string } */
export const GET_SKILL = `
MATCH (s:Skill {id: $id})
RETURN s
`;

/** Developers who have a given skill. Params: { id: string } */
export const GET_SKILL_USERS = `
MATCH (u:User)-[:HAS_SKILL]->(s:Skill {id: $id})
RETURN u
ORDER BY u.name ASC
`;

/** Projects that require a given skill. Params: { id: string } */
export const GET_SKILL_PROJECTS = `
MATCH (p:Project)-[:REQUIRES]->(s:Skill {id: $id})
RETURN p
ORDER BY p.year DESC
`;

/**
 * Related skills, found by hopping Skill -> Project -> Skill: any skill that shows
 * up on a project alongside this one is "related", ranked by how many projects they share.
 * Params: { id: string, limit: number }
 */
export const GET_RELATED_SKILLS = `
MATCH (s:Skill {id: $id})<-[:REQUIRES]-(p:Project)-[:REQUIRES]->(related:Skill)
WHERE related.id <> $id
WITH related, count(DISTINCT p) AS sharedProjects
RETURN related, sharedProjects
ORDER BY sharedProjects DESC, related.name ASC
LIMIT $limit
`;
