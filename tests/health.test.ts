import request from 'supertest';
import { createApp } from '../src/app';

jest.mock('../src/config/database', () => ({
  verifyConnectivity: jest.fn(),
}));

import { verifyConnectivity } from '../src/config/database';

describe('GET /api/health', () => {
  it('returns ok/connected when the database is reachable', async () => {
    (verifyConnectivity as jest.Mock).mockResolvedValue(true);

    const res = await request(createApp()).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok', database: 'connected' });
  });

  it('returns error/disconnected without leaking credentials when the database is unreachable', async () => {
    (verifyConnectivity as jest.Mock).mockResolvedValue(false);

    const res = await request(createApp()).get('/api/health');

    expect(res.status).toBe(503);
    expect(res.body).toEqual({ status: 'error', database: 'disconnected' });
    expect(JSON.stringify(res.body)).not.toMatch(/password/i);
  });
});
