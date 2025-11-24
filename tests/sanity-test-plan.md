# Sanity Test Plan for Admin and User APIs

## Overview

**Purpose**: This sanity test plan verifies the basic health and functionality of the admin and user API endpoints in the Next.js (App Router) project. Sanity tests focus on:

- Correct HTTP status codes (200/201 success, 400 bad request, 401 unauthorized, 403 forbidden, 404 not found, 500 error)
- Consistent response shapes: `{ success: boolean, data?: any, error?: string, count?: number, message?: string }`
- Authentication & Authorization: Unauthenticated requests return appropriate errors; authenticated requests succeed with expected data
- Input validation: Invalid payloads return 400
- No server crashes or unhandled errors
- Basic happy-path CRUD operations

Tests will **not** cover exhaustive edge cases, performance, or security vulnerabilities.

**Success Criteria**: All tests pass without 500 errors, correct statuses/shapes, and expected auth behaviors.

## Endpoints Inventory

### User Management APIs (`/api/users/*`)

| Endpoint | Methods | Role/Auth | Purpose | Expected Response Shape |
|----------|---------|-----------|---------|-------------------------|
| [`/api/users`](src/app/api/users/route.ts) | GET (query: `?type=&department=&isActive=&approvalStatus=`) | Public/User/Admin (Admin sees all; others see APPROVED only) | List users with filters | `{ success: true, data: User[] }` |
| | POST (body: User \| User[]) | Public | Create single/bulk users | `{ success: true, data: User \| User[], count?: number }` (201) |
| | PUT (body: `{ id, ...updates }`) | Authenticated User (self only) | Update own profile | `{ success: true, data: User }` |
| | DELETE (`?id=xxx`) | ? (likely Admin) | Delete user by ID | `{ success: true, data: User }` |
| [`/api/users/approve`](src/app/api/users/approve/route.ts) | PUT (body: `{ userId }`) | Admin (`admin_token`) | Approve user (sets APPROVED, creates Student if STUDENT/POSTDOC) | `{ success: true, message: "...", user: PartialUser }` |
| [`/api/users/reject`](src/app/api/users/reject/route.ts) | PUT (body: `{ userId }`) | Admin (`admin_token`) | Reject user (sets REJECTED, deletes Student if applicable) | `{ success: true, message: "...", user: PartialUser }` |
| [`/api/users/order`](src/app/api/users/order/route.ts) | POST (body: `{ orders: [{ id, order }] }`) | Admin? | Bulk update user display order | `{ success: true, data: User[] }` |

**User Shape** (inferred): `{ _id, firstName, lastName, email, userType, position, department?, approvalStatus, isActive, order, bio?, interests? }`

### Admin APIs (`/api/admin/*`)

| Endpoint | Methods | Role/Auth | Purpose | Expected Response Shape |
|----------|---------|-----------|---------|-------------------------|
| [`/api/admin/auth`](src/app/api/admin/auth/route.ts) | POST (body: `{ email, password }`) | Public | Admin login (hardcoded: `admin@mimsc.ma` / `Admin@123456`) | `{ success: true, user: { email, role } }` + `admin_token` cookie |
| [`/api/admin/logout`](src/app/api/admin/logout/route.ts) | POST | Admin | Logout (clear cookie) | `{ success: true, message: "..." }` |
| [`/api/admin/verify`](src/app/api/admin/verify/route.ts) | GET | Admin | Verify admin session | `{ success: true, user: { email, role } }` |

### Shared Auth APIs (`/api/auth`)

| Endpoint | Methods | Role/Auth | Purpose | Expected Response Shape |
|----------|---------|-----------|---------|-------------------------|
| [`/api/auth`](src/app/api/auth/route.ts) | POST (body: `{ action: "register"\|"login", firstName?, lastName?, email, password, position, userType }`) | Public | User register/login | `{ success: true, user: PartialUser }` + `user_token` cookie (login checks APPROVED) |
| | GET | Authenticated User | Verify user session | `{ success: true, user: User }` |
| | DELETE | Authenticated User | Logout (clear cookie) | `{ success: true, message: "..." }` |

## Test Cases

**General Pattern per Endpoint** (3-5 tests):
1. **Unauthenticated**: No cookies → 401 (or expected public behavior)
2. **Invalid Input**: Malformed body/query → 400 `{ success: false, error: "..." }`
3. **Unauthorized Role**: Wrong token → 401/403
4. **Happy Path**: Valid auth + input → 200/201 `{ success: true, data: ... }`
5. **Error Handling**: Invalid ID → 404

### Examples:

**GET /api/users** (`tests/api/user.spec.ts`):
```ts
test('unauthenticated lists approved users', async () => {
  const res = await request(app).get('/api/users');
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty('success', true);
  expect(Array.isArray(res.body.data)).toBe(true);
});

test('admin sees all users', async () => { /* with admin cookie */ });
test('invalid query', async () => { /* expect 200 still, no crash */ });
```

**POST /api/admin/auth**:
1. Valid creds → 200 + cookie
2. Invalid creds → 401
3. Missing fields → 400

**Full list in spec files.**

## Auth Flow for Tests

1. **User Token**: `POST /api/auth` `{ action: 'register', firstName: 'Test', ... }` → sets `user_token` (JWT: userId, email, role:'user')
2. **Admin Token**: `POST /api/admin/auth` hardcoded creds → sets `admin_token` (JWT: email, role:'admin')
3. **Cookies**: Supertest auto-manages via `.set('Cookie', ...)` or jar
4. **Verification**: Use `GET /api/auth` or `/admin/verify`

**lib/auth.ts** helpers: `requireAuth` (user_token), `requireAdmin`/`isAdmin` (admin_token)

## Test Data

- **Seed via `/api/seed`** if available, or `beforeEach`/`beforeAll`:
  - Pending User: `{ userType: 'STUDENT', approvalStatus: 'PENDING' }`
  - Approved User: `{ ..., approvalStatus: 'APPROVED' }`
  - Self User for PUT
- Use `@faker-js/faker` for realistic data
- Cleanup: `afterEach` delete test users by email prefix

**Example Seed**:
```ts
const testUser = await createUser({ email: 'test@example.com', approvalStatus: 'APPROVED' });
```

## Tech Stack Recommendation

**Primary**:
- **Jest**: Test runner (`npm i -D jest @types/jest ts-jest`)
- **Supertest**: API testing (`npm i -D supertest @types/supertest`)
- **mongodb-memory-server**: Isolated MongoDB (`npm i -D mongodb-memory-server`)
- **@faker-js/faker**: Test data (`npm i -D @faker-js/faker`)

**Setup**:
```bash
npm i -D jest @types/jest ts-jest supertest @types/supertest mongodb-memory-server @faker-js/faker
```

**jest.config.js**:
```js
const { defaults: tsjPreset } = require('ts-jest/presets');
module.exports = {
  ...tsjPreset,
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  moduleNameMapping: { '^@/(.*)$': '<rootDir>/src/$1' },
};
```

**tests/setup.ts**:
```ts
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connectDB } from '@/lib/mongodb'; // Mock/adjust for test DB
// Start memory DB, seed test data
```

**package.json scripts**:
```json
{ "test:api": "jest tests/api", "test:api:watch": "jest tests/api --watch" }
```

**Alternatives** (simpler):
- **curl/Postman**: Manual sanity checks
- **Playwright**: E2E with browser, but heavier

## File Structure

```
tests/
├── sanity-test-plan.md          # This file
├── setup.ts                     # DB setup, global mocks
├── api/
│   ├── auth.spec.ts             # /api/auth tests
│   ├── user.spec.ts             # /api/users* tests
│   └── admin.spec.ts            # /api/admin/* tests
└── utils/
    └── test-helpers.ts          # createUser(), loginAdmin(), etc.
```

**Example Spec** (`tests/api/user.spec.ts`):
```ts
import request from 'supertest';
import { app } from '../../../src/app'; // Import Next.js app handler

describe('User APIs', () => {
  // tests...
});
```

## Potential Challenges & Mitigations

| Challenge | Mitigation |
|-----------|------------|
| **DB Connection** | Use `mongodb-memory-server`; mock `connectDB` to test URI |
| **Auth Cookies/JWT** | Extract cookies from login responses; use Supertest cookie jar |
| **Mongoose Models** | Import real models; use `beforeEach` to seed/cleanup |
| **Docker/Mongo Deps** | Tests independent of Docker; memory server |
| **Next.js Handler** | Test API routes directly via `request(app)` (need app export or createTestApp) |
| **Prisma vs Mongoose** | Code uses Mongoose (`lib/models/User.ts`); ignore Prisma for tests |
| **Hardcoded Admin** | Use env vars or mock creds in tests |
| **Student Model Coupling** | Approve/reject tests verify no crash if Student ops fail (graceful) |

**Run Tests**: `npm run test:api`

**Next Steps**: Implement specs in Code mode, then run/verify.
