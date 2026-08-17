/** Lists all projects. Params: {} */
export const LIST_PROJECTS = `
MATCH (p:Project)
OPTIONAL MATCH (u:User)-[:WORKED_ON]->(p)
WITH p, count(DISTINCT u) AS developerCount
RETURN p, developerCount
ORDER BY p.year DESC, p.name ASC
`;

/**
 * Full project detail: the developers who worked on it, the skills it requires,
 * and related projects (found by hopping Project -> Skill -> Project).
 * Params: { id: string }
 */
export const GET_PROJECT_DETAIL = `
MATCH (p:Project {id: $id})
OPTIONAL MATCH (dev:User)-[:WORKED_ON]->(p)
WITH p, collect(DISTINCT dev) AS developers
OPTIONAL MATCH (p)-[:REQUIRES]->(s:Skill)
WITH p, developers, collect(DISTINCT s) AS requiredSkills
OPTIONAL MATCH (p)-[:REQUIRES]->(:Skill)<-[:REQUIRES]-(related:Project)
WHERE related.id <> $id
WITH p, developers, requiredSkills, collect(DISTINCT related) AS relatedProjects
RETURN p, developers, requiredSkills, relatedProjects[0..6] AS relatedProjects
`;
