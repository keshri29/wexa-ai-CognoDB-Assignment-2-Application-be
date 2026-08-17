import request from 'supertest';
import { createApp } from '../src/app';
import { AppError } from '../src/utils/AppError';

jest.mock('../src/services/graphService');

import * as graphService from '../src/services/graphService';

describe('GET /api/graph/path', () => {
  it('requires both from and to', async () => {
    const res = await request(createApp()).get('/api/graph/path?from=user-a');
    expect(res.status).toBe(400);
  });

  it('returns a found path', async () => {
    (graphService.findPath as jest.Mock).mockResolvedValue({
      found: true,
      length: 2,
      nodes: [
        { type: 'User', id: 'user-a', label: 'Developer A', data: {} },
        { type: 'Skill', id: 'react', label: 'React', data: {} },
        { type: 'User', id: 'user-b', label: 'Developer B', data: {} },
      ],
      relationships: [
        { type: 'HAS_SKILL', startId: 'user-a', endId: 'react' },
        { type: 'HAS_SKILL', startId: 'user-b', endId: 'react' },
      ],
    });

    const res = await request(createApp()).get('/api/graph/path?from=user-a&to=user-b');

    expect(res.status).toBe(200);
    expect(res.body.found).toBe(true);
    expect(res.body.nodes).toHaveLength(3);
  });

  it('surfaces a 404 when a developer id does not exist', async () => {
    (graphService.findPath as jest.Mock).mockRejectedValue(AppError.notFound('No developer found with id "missing"'));

    const res = await request(createApp()).get('/api/graph/path?from=user-a&to=missing');

    expect(res.status).toBe(404);
  });

  it('returns found:false when no path exists', async () => {
    (graphService.findPath as jest.Mock).mockResolvedValue({ found: false, length: 0, nodes: [], relationships: [] });

    const res = await request(createApp()).get('/api/graph/path?from=user-a&to=user-b');

    expect(res.status).toBe(200);
    expect(res.body.found).toBe(false);
  });
});
