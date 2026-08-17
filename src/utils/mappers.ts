import neo4j, { Node as Neo4jNode, Relationship as Neo4jRelationship, Path as Neo4jPath } from 'neo4j-driver';
import { PathNode, PathNodeType, PathRelationship, Project, Skill, User } from '../types';

/** Neo4j returns integers as Integer objects (to avoid JS float precision loss) — unwrap to a plain number. */
export function toNumber(value: unknown): number {
  if (neo4j.isInt(value)) return value.toNumber();
  return typeof value === 'number' ? value : Number(value);
}

export function mapUser(node: Neo4jNode): User {
  const p = node.properties;
  return {
    id: String(p.id),
    name: String(p.name),
    username: String(p.username),
    avatar: String(p.avatar),
    bio: String(p.bio ?? ''),
    location: String(p.location ?? ''),
    experience: toNumber(p.experience),
  };
}

export function mapUserSlim(node: Neo4jNode): Pick<User, 'id' | 'name' | 'username' | 'avatar'> {
  const p = node.properties;
  return { id: String(p.id), name: String(p.name), username: String(p.username), avatar: String(p.avatar) };
}

export function mapSkill(node: Neo4jNode): Skill {
  const p = node.properties;
  return { id: String(p.id), name: String(p.name), category: String(p.category) };
}

export function mapProject(node: Neo4jNode): Project {
  const p = node.properties;
  return {
    id: String(p.id),
    name: String(p.name),
    description: String(p.description ?? ''),
    category: String(p.category ?? ''),
    year: toNumber(p.year),
  };
}

/** Recursively converts any Neo4j Integer values to plain numbers so raw driver objects never reach the API response. */
function normalizeProperties(props: Record<string, unknown>): Record<string, unknown> {
  const normalized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    normalized[key] = neo4j.isInt(value) ? toNumber(value) : value;
  }
  return normalized;
}

function primaryLabel(node: Neo4jNode): PathNodeType {
  const labels = node.labels as string[];
  if (labels.includes('User')) return 'User';
  if (labels.includes('Skill')) return 'Skill';
  return 'Project';
}

function labelFor(node: Neo4jNode, type: PathNodeType): string {
  const p = node.properties;
  if (type === 'User') return String(p.name);
  return String(p.name);
}

/** Converts a raw Neo4j Path into the frontend-friendly node/relationship arrays used by the connection explorer. */
export function mapPath(path: Neo4jPath): { nodes: PathNode[]; relationships: PathRelationship[] } {
  const nodes: PathNode[] = path.segments.length
    ? [path.start, ...path.segments.map(s => s.end)].map(node => {
        const type = primaryLabel(node as Neo4jNode);
        return {
          type,
          id: String((node as Neo4jNode).properties.id),
          label: labelFor(node as Neo4jNode, type),
          data: normalizeProperties((node as Neo4jNode).properties),
        };
      })
    : [
        {
          type: primaryLabel(path.start as Neo4jNode),
          id: String((path.start as Neo4jNode).properties.id),
          label: labelFor(path.start as Neo4jNode, primaryLabel(path.start as Neo4jNode)),
          data: normalizeProperties((path.start as Neo4jNode).properties),
        },
      ];

  const relationships: PathRelationship[] = path.segments.map(segment => {
    const rel = segment.relationship as Neo4jRelationship;
    return {
      type: rel.type,
      startId: String((segment.start as Neo4jNode).properties.id),
      endId: String((segment.end as Neo4jNode).properties.id),
    };
  });

  return { nodes, relationships };
}
