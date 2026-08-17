import 'dotenv/config';
import { createApp } from './app';
import { closeDriver, verifyConnectivity } from './config/database';
import { logger } from './utils/logger';

const PORT = Number(process.env.PORT ?? 5000);

async function start() {
  const app = createApp();

  const connected = await verifyConnectivity();
  if (connected) {
    logger.info('Connected to CognoDB Cloud');
  } else {
    logger.warn('Could not verify database connectivity at startup — the API will still start, but requests will fail until the database is reachable.');
  }

  const server = app.listen(PORT, () => {
    logger.info(`SkillGraph API listening on http://localhost:${PORT}`);
  });

  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}, shutting down gracefully...`);
    server.close();
    await closeDriver();
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

start().catch(err => {
  logger.error('Failed to start server', err);
  process.exit(1);
});
