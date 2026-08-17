import request from 'supertest';
import { createApp } from '../src/app';
import { AppError } from '../src/utils/AppError';

jest.mock('../src/services/userService');

import * as userService from '../src/services/userService';

const sampleUser = {
  id: 'user-anurag-kumar',
  name: 'Anurag Kumar',
  username: 'anuragkumar',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anuragkumar',
  bio: 'MERN stack developer',
  location: 'Jaipur, India',
  experience: 2,
};

describe('GET /api/users', () => {
  it('returns a paginated list of users', async () => {
    (userService.listUsers as jest.Mock).mockResolvedValue({
      users: [{ ...sampleUser, topSkills: [], projectCount: 2 }],
      pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
    });

    const res = await request(createApp()).get('/api/users?skill=React');

    expect(res.status).toBe(200);
    expect(res.body.users).toHaveLength(1);
    expect(userService.listUsers).toHaveBeenCalledWith(
      expect.objectContaining({ skill: 'React' })
    );
  });

  it('rejects an invalid limit', async () => {
    const res = await request(createApp()).get('/api/users?limit=999');
    expect(res.status).toBe(400);
  });
});

describe('GET /api/users/:id', () => {
  it('returns a full profile', async () => {
    (userService.getUserProfile as jest.Mock).mockResolvedValue({
      ...sampleUser,
      skills: [],
      projects: [],
      followers: [],
      following: [],
    });

    const res = await request(createApp()).get(`/api/users/${sampleUser.id}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(sampleUser.id);
  });

  it('returns 404 for an unknown developer', async () => {
    (userService.getUserProfile as jest.Mock).mockRejectedValue(AppError.notFound('No developer found'));

    const res = await request(createApp()).get('/api/users/does-not-exist');

    expect(res.status).toBe(404);
  });
});

describe('GET /api/users/:id/recommendations', () => {
  it('returns ranked recommendations', async () => {
    (userService.getRecommendations as jest.Mock).mockResolvedValue([
      { user: sampleUser, sharedSkills: 3, sharedProjects: 1, score: 11, matchedSkills: [] },
    ]);

    const res = await request(createApp()).get(`/api/users/${sampleUser.id}/recommendations`);

    expect(res.status).toBe(200);
    expect(res.body.recommendations[0].score).toBe(11);
  });
});
