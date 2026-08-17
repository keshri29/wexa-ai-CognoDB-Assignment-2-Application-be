/**
 * Seeds CognoDB Cloud with a realistic demo dataset: ~100 developers, 25 skills,
 * 30 projects, and 300+ relationships between them.
 *
 * Safe to re-run: it clears the previously seeded demo data before recreating it,
 * so `npm run seed` is idempotent.
 *
 * Usage: npm run seed
 */
import 'dotenv/config';
import neo4j from 'neo4j-driver';
import { closeDriver, getDriver, withSession } from '../src/config/database';
import { logger } from '../src/utils/logger';
import { generateSeedData } from './data/generator';

async function createConstraints(): Promise<void> {
  await withSession(async session => {
    await session.run(`CREATE CONSTRAINT user_id_unique IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE`);
    await session.run(`CREATE CONSTRAINT skill_id_unique IF NOT EXISTS FOR (s:Skill) REQUIRE s.id IS UNIQUE`);
    await session.run(`CREATE CONSTRAINT project_id_unique IF NOT EXISTS FOR (p:Project) REQUIRE p.id IS UNIQUE`);
  }, neo4j.session.WRITE);
}

async function clearDemoData(): Promise<void> {
  await withSession(async session => {
    await session.run(`MATCH (n) WHERE n:User OR n:Skill OR n:Project DETACH DELETE n`);
  }, neo4j.session.WRITE);
}

async function seed(): Promise<void> {
  logger.info('Verifying database connectivity...');
  await getDriver().verifyConnectivity();
  logger.info('Connected. Creating uniqueness constraints...');
  await createConstraints();

  logger.info('Clearing existing demo data...');
  await clearDemoData();

  const data = generateSeedData();
  logger.info(`Generated ${data.skills.length} skills, ${data.projects.length} projects, ${data.users.length} users.`);

  await withSession(async session => {
    await session.run(
      `
      UNWIND $skills AS skill
      CREATE (s:Skill {id: skill.id, name: skill.name, category: skill.category})
      `,
      { skills: data.skills }
    );

    await session.run(
      `
      UNWIND $projects AS project
      CREATE (p:Project {
        id: project.id,
        name: project.name,
        description: project.description,
        category: project.category,
        year: project.year
      })
      `,
      { projects: data.projects.map(p => ({ ...p, year: neo4j.int(p.year) })) }
    );

    await session.run(
      `
      UNWIND $users AS user
      CREATE (u:User {
        id: user.id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        experience: user.experience
      })
      `,
      { users: data.users.map(u => ({ ...u, experience: neo4j.int(u.experience) })) }
    );

    await session.run(
      `
      UNWIND $rows AS row
      MATCH (p:Project {id: row.projectId})
      MATCH (s:Skill {id: row.skillId})
      MERGE (p)-[:REQUIRES]->(s)
      `,
      { rows: data.projects.flatMap(p => p.requiredSkills.map(skillId => ({ projectId: p.id, skillId }))) }
    );

    await session.run(
      `
      UNWIND $rows AS row
      MATCH (u:User {id: row.userId})
      MATCH (s:Skill {id: row.skillId})
      MERGE (u)-[:HAS_SKILL]->(s)
      `,
      { rows: data.users.flatMap(u => u.skills.map(skillId => ({ userId: u.id, skillId }))) }
    );

    await session.run(
      `
      UNWIND $rows AS row
      MATCH (u:User {id: row.userId})
      MATCH (p:Project {id: row.projectId})
      MERGE (u)-[:WORKED_ON]->(p)
      `,
      { rows: data.users.flatMap(u => u.projects.map(projectId => ({ userId: u.id, projectId }))) }
    );

    await session.run(
      `
      UNWIND $rows AS row
      MATCH (a:User {id: row.from})
      MATCH (b:User {id: row.to})
      MERGE (a)-[:FOLLOWS]->(b)
      `,
      { rows: data.relationships.follows }
    );
  }, neo4j.session.WRITE);

  const relationshipCount =
    data.projects.reduce((sum, p) => sum + p.requiredSkills.length, 0) +
    data.users.reduce((sum, u) => sum + u.skills.length + u.projects.length, 0) +
    data.relationships.follows.length;

  logger.info(`Seed complete: ${data.users.length} users, ${data.skills.length} skills, ${data.projects.length} projects, ~${relationshipCount} relationships.`);
}

seed()
  .catch(err => {
    logger.error('Seeding failed', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDriver();
  });
