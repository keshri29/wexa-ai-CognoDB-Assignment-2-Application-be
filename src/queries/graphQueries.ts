/**
 * Finds the shortest path between two developers through the whole graph — it may
 * cross FOLLOWS, HAS_SKILL, WORKED_ON, or REQUIRES relationships in either direction,
 * so the path can legitimately read "User -> Skill -> Project -> Skill -> User" as
 * easily as a direct FOLLOWS chain. Capped at 8 hops so the search stays bounded.
 * Params: { from: string, to: string }
 */
export const FIND_SHORTEST_PATH = `
MATCH (a:User {id: $from}), (b:User {id: $to})
MATCH path = shortestPath((a)-[*..8]-(b))
RETURN path
`;

/** Confirms both endpoint users exist, so the service can tell "not found" apart from "no path". */
export const USERS_EXIST = `
OPTIONAL MATCH (a:User {id: $from})
OPTIONAL MATCH (b:User {id: $to})
RETURN a IS NOT NULL AS fromExists, b IS NOT NULL AS toExists
`;

/** Graph-wide counts, computed live from the database rather than hardcoded. Params: {} */
export const GRAPH_STATS = `
CALL {
  MATCH (u:User) RETURN count(u) AS users
}
CALL {
  MATCH (s:Skill) RETURN count(s) AS skills
}
CALL {
  MATCH (p:Project) RETURN count(p) AS projects
}
CALL {
  MATCH ()-[r]->() RETURN count(r) AS relationships
}
RETURN users, skills, projects, relationships
`;
