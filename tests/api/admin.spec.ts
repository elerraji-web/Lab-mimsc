import { describe, it, expect } from '@jest/globals';
import { NextRequest, NextResponse } from 'next/server';
import { loginAsAdmin } from '../global-setup';
import { POST as adminAuth } from '@/app/api/admin/auth/route';
import { POST as adminLogout } from '@/app/api/admin/logout/route';
import { GET as adminVerify } from '@/app/api/admin/verify/route';
import { GET as getEvents, POST as createEvent, PUT as updateEvent, DELETE as deleteEvent } from '@/app/api/events/route';
import { GET as getPublications, POST as createPublication, PUT as updatePublication, DELETE as deletePublication } from '@/app/api/publications/route';
import { GET as getUsers, POST as createUser, PUT as updateUser, DELETE as deleteUser } from '@/app/api/users/route';
import { POST as createResearch } from '@/app/api/research/route';
import { POST as createStudent } from '@/app/api/students/route';

describe('Admin APIs', () => {
  let adminCookie: string;

  beforeAll(async () => {
    adminCookie = await loginAsAdmin();
  });

  describe('POST /api/admin/auth', () => {
    it('should return 400 for missing email or password', async () => {
      const req = new NextRequest('http://localhost:3000/api/admin/auth', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' }
      });

      const res = await adminAuth(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Email and password are required');
    });

    it('should return 401 for invalid credentials', async () => {
      const req = new NextRequest('http://localhost:3000/api/admin/auth', {
        method: 'POST',
        body: JSON.stringify({
          email: 'admin@mimsc.ma',
          password: 'wrongpassword'
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      const res = await adminAuth(req);
      const data = await res.json();

      expect(res.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid email or password');
    });

    it('should login successfully with valid credentials', async () => {
      const req = new NextRequest('http://localhost:3000/api/admin/auth', {
        method: 'POST',
        body: JSON.stringify({
          email: 'admin@mimsc.ma',
          password: 'Admin@123456'
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      const res = await adminAuth(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.user).toHaveProperty('email', 'admin@mimsc.ma');
      expect(data.user).toHaveProperty('role', 'admin');

      // Check cookie is set
      const setCookie = res.headers.get('set-cookie');
      expect(setCookie).toContain('admin_token');
    });
  });

  describe('POST /api/admin/logout', () => {
    it('should return 401 for unauthenticated request', async () => {
      const req = new NextRequest('http://localhost:3000/api/admin/logout', {
        method: 'POST'
      });

      const res = await adminLogout(req);
      const data = await res.json();

      expect(res.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Admin authentication required');
    });

    it('should logout successfully for authenticated admin', async () => {
      const req = new NextRequest('http://localhost:3000/api/admin/logout', {
        method: 'POST',
        headers: { cookie: adminCookie }
      });

      const res = await adminLogout(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Logged out successfully');

      // Check cookie is cleared
      const setCookie = res.headers.get('set-cookie');
      expect(setCookie).toContain('admin_token=;');
    });
  });

  describe('GET /api/admin/verify', () => {
    it('should return 401 for unauthenticated request', async () => {
      const req = new NextRequest('http://localhost:3000/api/admin/verify');

      const res = await adminVerify(req);
      const data = await res.json();

      expect(res.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('No authentication token');
    });

    it('should verify successfully for authenticated admin', async () => {
      const req = new NextRequest('http://localhost:3000/api/admin/verify', {
        headers: { cookie: adminCookie }
      });

      const res = await adminVerify(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.user).toHaveProperty('email', 'admin@mimsc.ma');
      expect(data.user).toHaveProperty('role', 'admin');
    });
  });

  describe('Events CRUD', () => {
    let eventId: string;

    it('should allow admin to create event', async () => {
      const eventData = {
        title: 'Admin Test Event',
        description: 'Test event created by admin',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 86400000).toISOString(),
        type: 'CONFERENCE',
        status: 'UPCOMING',
        location: 'Test Location'
      };
      const req = new NextRequest('http://localhost:3000/api/events', {
        method: 'POST',
        body: JSON.stringify(eventData),
        headers: { 'Content-Type': 'application/json', cookie: adminCookie }
      });
      const res = await createEvent(req);
      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.data.title).toBe(eventData.title);
      eventId = data.data._id;
    });

    it('should allow admin to read events', async () => {
      const req = new NextRequest('http://localhost:3000/api/events', {
        headers: { cookie: adminCookie }
      });
      const res = await getEvents(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data.length).toBeGreaterThan(0);
    });

    it('should allow admin to update event', async () => {
      const updateData = {
        id: eventId,
        title: 'Updated Admin Test Event'
      };
      const req = new NextRequest('http://localhost:3000/api/events', {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: { 'Content-Type': 'application/json', cookie: adminCookie }
      });
      const res = await updateEvent(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.data.title).toBe(updateData.title);
    });

    it('should allow admin to delete event', async () => {
      const req = new NextRequest(`http://localhost:3000/api/events?id=${eventId}`, {
        method: 'DELETE',
        headers: { cookie: adminCookie }
      });
      const res = await deleteEvent(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
    });

    it('should require authentication for creating event', async () => {
      const eventData = {
        title: 'Unauthorized Event',
        description: 'Should fail',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 86400000).toISOString(),
        type: 'CONFERENCE',
        status: 'UPCOMING',
        location: 'Test Location'
      };
      const req = new NextRequest('http://localhost:3000/api/events', {
        method: 'POST',
        body: JSON.stringify(eventData),
        headers: { 'Content-Type': 'application/json' }
      });
      const res = await createEvent(req);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.success).toBe(false);
    });
  });

  describe('Publications CRUD', () => {
    let pubId: string;

    it('should allow admin to create publication', async () => {
      const pubData = {
        title: 'Admin Test Publication',
        authors: ['Admin Tester'],
        year: 2024,
        type: 'JOURNAL',
        doi: '10.1234/admin-test'
      };
      const req = new NextRequest('http://localhost:3000/api/publications', {
        method: 'POST',
        body: JSON.stringify(pubData),
        headers: { 'Content-Type': 'application/json', cookie: adminCookie }
      });
      const res = await createPublication(req);
      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.data.title).toBe(pubData.title);
      pubId = data.data._id;
    });

    it('should allow admin to read publications', async () => {
      const req = new NextRequest('http://localhost:3000/api/publications', {
        headers: { cookie: adminCookie }
      });
      const res = await getPublications(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data.length).toBeGreaterThan(0);
    });

    it('should allow admin to update publication', async () => {
      const updateData = {
        id: pubId,
        title: 'Updated Admin Test Publication'
      };
      const req = new NextRequest('http://localhost:3000/api/publications', {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: { 'Content-Type': 'application/json', cookie: adminCookie }
      });
      const res = await updatePublication(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.data.title).toBe(updateData.title);
    });

    it('should allow admin to delete publication', async () => {
      const req = new NextRequest(`http://localhost:3000/api/publications?id=${pubId}`, {
        method: 'DELETE',
        headers: { cookie: adminCookie }
      });
      const res = await deletePublication(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
    });
  });

  describe('Users CRUD', () => {
    let userId: string;

    it('should allow admin to create user', async () => {
      const userData = {
        firstName: 'Admin',
        lastName: 'TestUser',
        email: 'admin-test@example.com',
        password: 'TestPass123',
        userType: 'RESEARCHER'
      };
      const req = new NextRequest('http://localhost:3000/api/users', {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: { 'Content-Type': 'application/json', cookie: adminCookie }
      });
      const res = await createUser(req);
      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.data.email).toBe(userData.email);
      userId = data.data._id;
    });

    it('should allow admin to read all users', async () => {
      const req = new NextRequest('http://localhost:3000/api/users', {
        headers: { cookie: adminCookie }
      });
      const res = await getUsers(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data.length).toBeGreaterThan(0);
    });

    it('should allow admin to update other users', async () => {
      const updateData = {
        id: userId,
        firstName: 'Updated Admin'
      };
      const req = new NextRequest('http://localhost:3000/api/users', {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: { 'Content-Type': 'application/json', cookie: adminCookie }
      });
      const res = await updateUser(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.data.firstName).toBe(updateData.firstName);
    });

    it('should allow admin to delete user', async () => {
      const req = new NextRequest(`http://localhost:3000/api/users?id=${userId}`, {
        method: 'DELETE',
        headers: { cookie: adminCookie }
      });
      const res = await deleteUser(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
    });
  });

  describe('Research CRUD', () => {
    it('should allow admin to create research', async () => {
      // Create a lead user first
      const leadUserData = {
        firstName: 'Lead',
        lastName: 'Researcher',
        email: 'lead-research@example.com',
        password: 'LeadPass123',
        userType: 'RESEARCHER'
      };
      const userReq = new NextRequest('http://localhost:3000/api/users', {
        method: 'POST',
        body: JSON.stringify(leadUserData),
        headers: { 'Content-Type': 'application/json', cookie: adminCookie }
      });
      const userRes = await createUser(userReq);
      const userData = await userRes.json();
      const leadId = userData.data._id;

      const researchData = {
        title: 'Admin Test Research',
        description: 'Test research created by admin',
        lead: leadId,
        status: 'ACTIVE'
      };
      const req = new NextRequest('http://localhost:3000/api/research', {
        method: 'POST',
        body: JSON.stringify(researchData),
        headers: { 'Content-Type': 'application/json', cookie: adminCookie }
      });
      const res = await createResearch(req);
      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.data.title).toBe(researchData.title);
    });
  });

  describe('Students CRUD', () => {
    it('should allow admin to create student', async () => {
      // Create a supervisor user first
      const supervisorData = {
        firstName: 'Supervisor',
        lastName: 'Prof',
        email: 'supervisor-research@example.com',
        password: 'SuperPass123',
        userType: 'PROFESSOR'
      };
      const userReq = new NextRequest('http://localhost:3000/api/users', {
        method: 'POST',
        body: JSON.stringify(supervisorData),
        headers: { 'Content-Type': 'application/json', cookie: adminCookie }
      });
      const userRes = await createUser(userReq);
      const userData = await userRes.json();
      const supervisorId = userData.data._id;

      const studentData = {
        firstName: 'Test',
        lastName: 'Student',
        email: 'student-research@example.com',
        studentType: 'PHD',
        supervisor: supervisorId
      };
      const req = new NextRequest('http://localhost:3000/api/students', {
        method: 'POST',
        body: JSON.stringify(studentData),
        headers: { 'Content-Type': 'application/json', cookie: adminCookie }
      });
      const res = await createStudent(req);
      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.data.email).toBe(studentData.email);
    });
  });
});