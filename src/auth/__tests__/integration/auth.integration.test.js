const app = require('../../../app');
const request = require('supertest');

const validBody = {
  fullName: 'test',
  email: 'test@test.com',
  password: 'test1234',
};

describe('Auth integration', () => {
  describe('POST /v1/auth/register', () => {
    it('should register a new user and return 201 with a token', async () => {
      const res = await request(app).post('/v1/auth/register').send(validBody);

      expect(res.status).toBe(201);
      expect(res.body.data.accessToken).toBeDefined();
    });

    it('should return 409', async () => {
      await request(app).post('/v1/auth/register').send(validBody);

      const res = await request(app).post('/v1/auth/register').send(validBody);

      expect(res.status).toBe(409);
    });
  });
});
