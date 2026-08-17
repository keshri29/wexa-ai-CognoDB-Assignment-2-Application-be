import neo4j, { Driver, Session, SessionMode } from 'neo4j-driver';
import { logger } from '../utils/logger';

let driver: Driver | null = null;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getDriver(): Driver {
  if (driver) return driver;

  const uri = requireEnv('COGNODB_URI');
  const username = requireEnv('COGNODB_USERNAME');
  const password = requireEnv('COGNODB_PASSWORD');

  driver = neo4j.driver(uri, neo4j.auth.basic(username, password), {
    maxConnectionPoolSize: 50,
    connectionAcquisitionTimeout: 10_000,
  });

  return driver;
}

export function getSession(mode: SessionMode = neo4j.session.READ): Session {
  return getDriver().session({ defaultAccessMode: mode });
}

export async function verifyConnectivity(): Promise<boolean> {
  try {
    await getDriver().verifyConnectivity();
    return true;
  } catch (err) {
    logger.error('Database connectivity check failed', err);
    return false;
  }
}

export async function closeDriver(): Promise<void> {
  if (driver) {
    await driver.close();
    driver = null;
  }
}

/**
 * Runs a unit of work in a managed session and guarantees the session is closed,
 * regardless of success or failure. All repositories should go through this
 * instead of opening sessions directly.
 */
export async function withSession<T>(
  work: (session: Session) => Promise<T>,
  mode: SessionMode = neo4j.session.READ
): Promise<T> {
  const session = getSession(mode);
  try {
    return await work(session);
  } finally {
    await session.close();
  }
}
