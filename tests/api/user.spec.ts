import { describe, it, expect } from '@jest/globals';
import { NextRequest, NextResponse } from 'next/server';
import User from '@/lib/models/User';
import { loginAsUser, loginAsTestAdmin } from '../global-setup';
import { GET as getUsers, POST as createUser, PUT as updateUser, DELETE as deleteUser } from '@/app/api/users/route';
import { POST as login } from '@/app/api/auth/route';
import { POST as createPublication, PUT as updatePublication, DELETE as deletePublication } from '@/app/api/publications/route';
import { POST as createEvent } from '@/app/api/events/route';

describe('User API', () => {
  let userCookie: string;
  let adminCookie: string;
  let testUserId: string;

  beforeEach(async () => {
    userCookie = await loginAsUser();
    adminCookie = await loginAsTestAdmin();

    // Get test user ID
    const user = await User.findOne({ email: 'testuser@example.com' });
    testUserId = user!._id.toString();
  });

  describe('GET /api/users', () => {
    it('should return approved users for non-admin', async () => {
      const req = new NextRequest('http://localhost:3000/api/users', {
        headers: { cookie: userCookie }
      });

      const res = await getUsers(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
    });

    it('should return all users for admin', async () => {
      const req = new NextRequest('http://localhost:3000/api/users', {
        headers: { 'Authorization': adminCookie }
      });

      const res = await getUsers(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
    });

    it('should filter by userType', async () => {
      const req = new NextRequest('http://localhost:3000/api/users?type=FACULTY', {
        headers: { cookie: adminCookie }
      });

      const res = await getUsers(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      data.data.forEach((user: any) => {
        expect(user.userType).toBe('FACULTY');
      });
    });
  
    describe('Publication Management', () => {
      it('should allow user to create publication', async () => {
        const pubData = {
          title: 'User Publication',
          authors: ['Test User'],
          type: 'JOURNAL_ARTICLE',
          year: 2023,
          journal: 'Test Journal',
          doi: '10.1000/testuser'
        };
  
        const req = new NextRequest('http://localhost:3000/api/publications', {
          method: 'POST',
          body: JSON.stringify(pubData),
          headers: { 'Content-Type': 'application/json', 'Authorization': userCookie }
        });
  
        const res = await createPublication(req);
        const data = await res.json();
  
        expect(res.status).toBe(201);
        expect(data.success).toBe(true);
        expect(data.data.title).toBe('User Publication');
      });
  
      it('should allow user to delete their own publication', async () => {
        // First create a publication
        const pubData = {
          title: 'Own Publication',
          authors: ['Test User'],
          type: 'JOURNAL_ARTICLE',
          year: 2023,
          journal: 'Test Journal',
          doi: '10.1000/own'
        };
  
        const createReq = new NextRequest('http://localhost:3000/api/publications', {
          method: 'POST',
          body: JSON.stringify(pubData),
          headers: { 'Content-Type': 'application/json', 'Authorization': userCookie }
        });
  
        const createRes = await createPublication(createReq);
        const createData = await createRes.json();
        const pubId = createData.data._id;
  
        // Now delete it
        const deleteReq = new NextRequest(`http://localhost:3000/api/publications?id=${pubId}`, {
          method: 'DELETE',
          headers: { 'Authorization': userCookie }
        });
  
        const deleteRes = await deletePublication(deleteReq);
        const deleteData = await deleteRes.json();
  
        expect(deleteRes.status).toBe(200);
        expect(deleteData.success).toBe(true);
      });
  
      it('should not allow user to delete other user publication', async () => {
        // Create a publication as admin
        const pubData = {
          title: 'Other Publication',
          authors: ['Test Admin'],
          type: 'JOURNAL_ARTICLE',
          year: 2023,
          journal: 'Test Journal',
          doi: '10.1000/other'
        };
  
        const createReq = new NextRequest('http://localhost:3000/api/publications', {
          method: 'POST',
          body: JSON.stringify(pubData),
          headers: { 'Content-Type': 'application/json', 'Authorization': adminCookie }
        });
  
        const createRes = await createPublication(createReq);
        const createData = await createRes.json();
        const pubId = createData.data._id;
  
        // Now try to delete as user
        const deleteReq = new NextRequest(`http://localhost:3000/api/publications?id=${pubId}`, {
          method: 'DELETE',
          headers: { 'Authorization': userCookie }
        });
  
        const deleteRes = await deletePublication(deleteReq);
        const deleteData = await deleteRes.json();
  
        expect(deleteRes.status).toBe(403);
        expect(deleteData.success).toBe(false);
      });
  
      it('should fail to delete publication without authentication', async () => {
        // Create a publication
        const pubData = {
          title: 'Unauth Publication',
          authors: ['Test User'],
          type: 'JOURNAL_ARTICLE',
          year: 2023,
          journal: 'Test Journal',
          doi: '10.1000/unauth'
        };
  
        const createReq = new NextRequest('http://localhost:3000/api/publications', {
          method: 'POST',
          body: JSON.stringify(pubData),
          headers: { 'Content-Type': 'application/json', 'Authorization': userCookie }
        });
  
        const createRes = await createPublication(createReq);
        const createData = await createRes.json();
        const pubId = createData.data._id;
  
        // Now delete without auth
        const deleteReq = new NextRequest(`http://localhost:3000/api/publications?id=${pubId}`, {
          method: 'DELETE'
        });
  
        const deleteRes = await deletePublication(deleteReq);
        expect(deleteRes.status).toBe(401);
      });
    });
  });

  describe('POST /api/users', () => {
    it('should create a single user', async () => {
      const newUser = {
        firstName: 'New',
        lastName: 'User',
        email: 'newuser@example.com',
        password: 'password123',
        position: 'Researcher',
        userType: 'FACULTY',
        isActive: true,
        approvalStatus: 'PENDING'
      };

      const req = new NextRequest('http://localhost:3000/api/users', {
        method: 'POST',
        body: JSON.stringify(newUser),
        headers: { 'Content-Type': 'application/json', cookie: adminCookie }
      });

      const res = await createUser(req);
      const data = await res.json();

      expect(res.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.email).toBe('newuser@example.com');
    });

    it('should create multiple users', async () => {
      const newUsers = [
        {
          firstName: 'Bulk1',
          lastName: 'User',
          email: 'bulk1@example.com',
          password: 'password123',
          position: 'Researcher',
          userType: 'FACULTY',
          isActive: true,
          approvalStatus: 'PENDING'
        },
        {
          firstName: 'Bulk2',
          lastName: 'User',
          email: 'bulk2@example.com',
          password: 'password123',
          position: 'Researcher',
          userType: 'FACULTY',
          isActive: true,
          approvalStatus: 'PENDING'
        }
      ];

      const req = new NextRequest('http://localhost:3000/api/users', {
        method: 'POST',
        body: JSON.stringify(newUsers),
        headers: { 'Content-Type': 'application/json', cookie: adminCookie }
      });

      const res = await createUser(req);
      const data = await res.json();

      expect(res.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.count).toBe(2);
    });

    it('should fail to create user without authentication', async () => {
      const newUser = {
        firstName: 'Unauth',
        lastName: 'User',
        email: 'unauth@example.com',
        password: 'password123',
        position: 'Researcher',
        userType: 'FACULTY',
        isActive: true,
        approvalStatus: 'PENDING'
      };

      const req = new NextRequest('http://localhost:3000/api/users', {
        method: 'POST',
        body: JSON.stringify(newUser),
        headers: { 'Content-Type': 'application/json' }
      });

      const res = await createUser(req);
      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/users', () => {
    it('should update own profile', async () => {
      const updateData = {
        id: testUserId,
        firstName: 'Updated',
        lastName: 'User'
      };

      const req = new NextRequest('http://localhost:3000/api/users', {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: { 'Content-Type': 'application/json', 'Authorization': userCookie }
      });

      const res = await updateUser(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.firstName).toBe('Updated');
    });

    it('should not allow updating other user profile', async () => {
      // Create a new user for this test since beforeEach deletes all users
      const newUserData = {
        firstName: 'New',
        lastName: 'User',
        email: 'newuser@example.com',
        password: 'password123',
        position: 'Researcher',
        userType: 'FACULTY',
        isActive: true,
        approvalStatus: 'PENDING'
      };
      const createReq = new NextRequest('http://localhost:3000/api/users', {
        method: 'POST',
        body: JSON.stringify(newUserData),
        headers: { 'Content-Type': 'application/json', 'Authorization': adminCookie }
      });
      await createUser(createReq);

      const otherUser = await User.findOne({ email: 'newuser@example.com' });
      const updateData = {
        id: otherUser!._id.toString(),
        firstName: 'Hacked'
      };

      const req = new NextRequest('http://localhost:3000/api/users', {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: { 'Content-Type': 'application/json', 'Authorization': userCookie }
      });

      const res = await updateUser(req);
      const data = await res.json();

      expect(res.status).toBe(403);
      expect(data.success).toBe(false);
    });
  });

  describe('DELETE /api/users', () => {
    it('should delete a user', async () => {
      const deleteUserData = {
        firstName: 'Delete',
        lastName: 'User',
        email: 'delete@example.com',
        password: 'password123',
        position: 'Researcher',
        userType: 'FACULTY',
        isActive: true,
        approvalStatus: 'APPROVED'
      };

      const createDeleteReq = new NextRequest('http://localhost:3000/api/users', {
        method: 'POST',
        body: JSON.stringify(deleteUserData),
        headers: { 'Content-Type': 'application/json', 'Authorization': adminCookie }
      });

      await createUser(createDeleteReq);

      const userToDelete = await User.findOne({ email: 'delete@example.com' });

      const req = new NextRequest(`http://localhost:3000/api/users?id=${userToDelete!._id}`, {
        method: 'DELETE',
        headers: { Authorization: adminCookie }
      });

      const res = await deleteUser(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it('should fail to delete user without authentication', async () => {
      const deleteUserData = {
        firstName: 'DeleteUnauth',
        lastName: 'User',
        email: 'deleteunauth@example.com',
        password: 'password123',
        position: 'Researcher',
        userType: 'FACULTY',
        isActive: true,
        approvalStatus: 'APPROVED'
      };

      const createDeleteReq = new NextRequest('http://localhost:3000/api/users', {
        method: 'POST',
        body: JSON.stringify(deleteUserData),
        headers: { 'Content-Type': 'application/json', 'Authorization': adminCookie }
      });

      await createUser(createDeleteReq);

      const userToDelete = await User.findOne({ email: 'deleteunauth@example.com' });

      const req = new NextRequest(`http://localhost:3000/api/users?id=${userToDelete!._id}`, {
        method: 'DELETE'
      });

      const res = await deleteUser(req);
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/events', () => {
    it('should not allow regular user to create event', async () => {
      const eventData = {
        title: 'Test Event',
        description: 'Test Description',
        type: 'SEMINAR',
        startDate: new Date(),
        endDate: new Date(Date.now() + 3600000),
        location: 'Test Location',
        status: 'UPCOMING'
      };

      const req = new NextRequest('http://localhost:3000/api/events', {
        method: 'POST',
        body: JSON.stringify(eventData),
        headers: { 'Content-Type': 'application/json', 'Authorization': userCookie }
      });

      const res = await createEvent(req);
      expect(res.status).toBe(403);
    });
  });
});