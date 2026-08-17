/**
 * Lists users, optionally filtered by an exact skill name (case-insensitive) and/or a
 * name/username substring search, then attaches each user's top 4 skills and project count.
 * Params: { skill: string | null, search: string | null, skip: number, limit: number }
 */
export const SEARCH_USERS = `
MATCH (u:User)
WHERE ($skill IS NULL OR EXISTS {
        MATCH (u)-[:HAS_SKILL]->(s:Skill)
        WHERE toLower(s.name) = toLower($skill)
      })
  AND ($search IS NULL OR toLower(u.name) CONTAINS toLower($search) OR toLower(u.username) CONTAINS toLower($search))
WITH u
ORDER BY u.name ASC
SKIP $skip LIMIT $limit
OPTIONAL MATCH (u)-[:HAS_SKILL]->(s:Skill)
WITH u, collect(DISTINCT s) AS allSkills
OPTIONAL MATCH (u)-[:WORKED_ON]->(p:Project)
WITH u, allSkills, count(DISTINCT p) AS projectCount
RETURN u, allSkills[0..4] AS topSkills, projectCount
ORDER BY u.name ASC
`;

/** Total count matching the same filters as SEARCH_USERS, for pagination metadata. */
export const COUNT_USERS = `
MATCH (u:User)
WHERE ($skill IS NULL OR EXISTS {
        MATCH (u)-[:HAS_SKILL]->(s:Skill)
        WHERE toLower(s.name) = toLower($skill)
      })
  AND ($search IS NULL OR toLower(u.name) CONTAINS toLower($search) OR toLower(u.username) CONTAINS toLower($search))
RETURN count(u) AS total
`;

/**
 * Full profile traversal: the user's skills, projects, and both directions of the
 * FOLLOWS relationship, gathered in a single round trip.
 * Params: { id: string }
 */
export const GET_USER_PROFILE = `
MATCH (u:User {id: $id})
OPTIONAL MATCH (u)-[:HAS_SKILL]->(s:Skill)
WITH u, collect(DISTINCT s) AS skills
OPTIONAL MATCH (u)-[:WORKED_ON]->(p:Project)
WITH u, skills, collect(DISTINCT p) AS projects
OPTIONAL MATCH (follower:User)-[:FOLLOWS]->(u)
WITH u, skills, projects, collect(DISTINCT follower) AS followers
OPTIONAL MATCH (u)-[:FOLLOWS]->(followee:User)
RETURN u, skills, projects, followers, collect(DISTINCT followee) AS following
`;

/**
 * Recommendation query: developers who share skills (and bonus points for shared
 * project experience) with the given user, ranked by a weighted score.
 * Params: { userId: string, limit: number }
 */
export const GET_RECOMMENDATIONS = `
MATCH (u:User {id: $userId})-[:HAS_SKILL]->(s:Skill)<-[:HAS_SKILL]-(candidate:User)
WHERE candidate.id <> $userId
WITH u, candidate, collect(DISTINCT s) AS matchedSkills
WITH u, candidate, matchedSkills, size(matchedSkills) AS sharedSkills
OPTIONAL MATCH (u)-[:WORKED_ON]->(p:Project)<-[:WORKED_ON]-(candidate)
WITH candidate, matchedSkills, sharedSkills, count(DISTINCT p) AS sharedProjects
RETURN candidate,
       matchedSkills,
       sharedSkills,
       sharedProjects,
       (sharedSkills * 3 + sharedProjects * 2) AS score
ORDER BY score DESC, candidate.name ASC
LIMIT $limit
`;
