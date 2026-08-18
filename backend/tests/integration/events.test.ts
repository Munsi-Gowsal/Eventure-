import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../../src/app';
import { User } from '../../src/modules/auth/auth.model';

describe('Events Endpoints', () => {
  let adminToken: string;
  let userToken: string;
  let eventId: string;

  beforeAll(async () => {
    // Register User
    const userRes = await request(app).post('/api/v1/auth/register').send({
      fullName: 'Regular User',
      email: 'user@example.com',
      password: 'Password123!',
    });
    userToken = userRes.body.data.accessToken;

    const { AuthService } = await import('../../src/modules/auth/auth.service');
    const tokens = await AuthService.register('Admin 2', 'admin2@example.com', 'Pass123!', 'ADMIN');
    adminToken = tokens.accessToken;
    
    // Create an event for registration tests
    const eventRes = await request(app)
      .post('/api/v1/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Registration Test Event',
        category: 'Test',
        date: '2030-01-01T10:00:00Z',
        maxAttendees: 10
      });
    eventId = eventRes.body.data._id;
  });

  it('should prevent regular users from creating events', async () => {
    const res = await request(app)
      .post('/api/v1/events')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Test Event',
        category: 'Test',
        date: '2030-01-01T10:00:00Z',
        maxAttendees: 10
      });
    
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('FORBIDDEN');
  });

  it('should allow admins to create events', async () => {
    const res = await request(app)
      .post('/api/v1/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Admin Event',
        category: 'Test',
        date: '2030-01-01T10:00:00Z',
        maxAttendees: 10
      });
    
    expect(res.status).toBe(201);
    expect(res.body.data._id).toBeDefined();
    eventId = res.body.data._id;
  });

  it('should allow users to register for an event', async () => {
    const res = await request(app)
      .post(`/api/v1/events/${eventId}/register`)
      .set('Authorization', `Bearer ${userToken}`);
      
    expect(res.status).toBe(200);
    expect(res.body.data.attendees).toBe(1);
  });

  it('should prevent duplicate registrations', async () => {
    const res = await request(app)
      .post(`/api/v1/events/${eventId}/register`)
      .set('Authorization', `Bearer ${userToken}`);
      
    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('CONFLICT');
  });

  it('should allow admins to view event registrations', async () => {
    const res = await request(app)
      .get(`/api/v1/events/${eventId}/registrations`)
      .set('Authorization', `Bearer ${adminToken}`);
      
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].status).toBe('REGISTERED');
  });

  it('should allow users to view their own registrations', async () => {
    const res = await request(app)
      .get(`/api/v1/me/registrations`)
      .set('Authorization', `Bearer ${userToken}`);
      
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].eventId._id).toBe(eventId);
  });

  it('should allow users to cancel their registration', async () => {
    const res = await request(app)
      .delete(`/api/v1/events/${eventId}/register`)
      .set('Authorization', `Bearer ${userToken}`);
      
    expect(res.status).toBe(200);

    // Verify attendee count decremented
    const eventRes = await request(app).get(`/api/v1/events/${eventId}`);
    expect(eventRes.body.data.attendees).toBe(0);
  });

  it('should allow users to re-register after cancelling', async () => {
    const res = await request(app)
      .post(`/api/v1/events/${eventId}/register`)
      .set('Authorization', `Bearer ${userToken}`);
      
    expect(res.status).toBe(200);
    expect(res.body.data.attendees).toBe(1);
  });
});
