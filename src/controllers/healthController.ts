import { Request, Response } from 'express';
import { verifyConnectivity } from '../config/database';
import { HealthStatus } from '../types';

export async function getHealth(_req: Request, res: Response) {
  const connected = await verifyConnectivity();
  const body: HealthStatus = {
    status: connected ? 'ok' : 'error',
    database: connected ? 'connected' : 'disconnected',
  };
  res.status(connected ? 200 : 503).json(body);
}
