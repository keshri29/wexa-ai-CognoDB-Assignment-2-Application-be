export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  location: string;
  experience: number;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  year: number;
}

export interface UserSummary extends User {
  topSkills: Skill[];
  projectCount: number;
}

export interface UserProfile extends User {
  skills: Skill[];
  projects: Project[];
  followers: Pick<User, 'id' | 'name' | 'username' | 'avatar'>[];
  following: Pick<User, 'id' | 'name' | 'username' | 'avatar'>[];
}

export interface Recommendation {
  user: User;
  sharedSkills: number;
  sharedProjects: number;
  score: number;
  matchedSkills: Skill[];
}

export interface RelatedSkill {
  skill: Skill;
  sharedProjects: number;
}

export interface ProjectDetail extends Project {
  developers: Pick<User, 'id' | 'name' | 'username' | 'avatar'>[];
  requiredSkills: Skill[];
  relatedProjects: Pick<Project, 'id' | 'name' | 'category'>[];
}

export type PathNodeType = 'User' | 'Skill' | 'Project';

export interface PathNode {
  type: PathNodeType;
  id: string;
  label: string;
  data: Record<string, unknown>;
}

export interface PathRelationship {
  type: string;
  startId: string;
  endId: string;
}

export interface GraphPath {
  found: boolean;
  length: number;
  nodes: PathNode[];
  relationships: PathRelationship[];
}

export interface GraphStats {
  users: number;
  skills: number;
  projects: number;
  relationships: number;
}

export interface HealthStatus {
  status: 'ok' | 'error';
  database: 'connected' | 'disconnected';
}
