import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app';

describe('Auth Endpoints', () => {
  it('should register a new user as ATTENDEE by default', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      });
      
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
  });

  it('should fail to register with an existing email', async () => {
    await request(app).post('/api/v1/auth/register').send({
      fullName: 'Test User',
      email: 'duplicate@example.com',
      password: 'Password123!',
    });

    const res = await request(app).post('/api/v1/auth/register').send({
      fullName: 'Another User',
      email: 'duplicate@example.com',
      password: 'Password123!',
    });
    
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('CONFLICT');
  });

  it('should login an existing user', async () => {
    await request(app).post('/api/v1/auth/register').send({
      fullName: 'Login User',
      email: 'login@example.com',
      password: 'Password123!',
    });

    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'login@example.com',
      password: 'Password123!',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    // Verify refresh token is set in cookie
    expect(res.headers['set-cookie']).toBeDefined();
  });
});
