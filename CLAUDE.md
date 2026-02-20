# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack emergency relief management application with:
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript + MongoDB (Mongoose)
- **Architecture**: Monorepo with separate `/frontend` and `/backend` directories

The application manages user authentication, seat/reservation management, and admin dashboards with role-based access control (admin, shifty, cashier).

---

## Quick Start Commands

### Frontend
```bash
cd frontend
npm install
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Backend
```bash
cd backend
npm install
npm run dev          # Start dev server with hot reload (port 5000)
npm run build        # Compile TypeScript to dist/
npm run start        # Run compiled JavaScript
npm run db:migrate   # Run Prisma migrations (if using Prisma)
npm run db:studio    # Open Prisma Studio
npm run seed:seats   # Seed seat data
```

---

## Architecture & Key Patterns

### Frontend Architecture

**Path Aliases** (configured in `vite.config.ts` and `tsconfig.json`):
- `@/*` → `src/*`
- `@interfaces` → `src/interfaces`
- `@services` → `src/services`
- `components` → `src/components`

**Directory Structure**:
- `src/components/` - React components organized by feature (auth, dashboard, common, layout, navigation)
- `src/services/` - API service layer (AuthService, AdminService, SeatService, CourseService, StatsService)
- `src/context/` - React Context providers (AuthContext, ToastContext)
- `src/interfaces/` - TypeScript interfaces organized by type (models, requests, context)
- `src/lib/` - Utility libraries (api.ts with Axios instances, utils.ts)
- `src/pages/` - Page-level components
- `src/hooks/` - Custom React hooks

**API Communication**:
- Uses Axios with interceptors for authentication
- Token stored in `sessionStorage` as `accessToken`
- API instances in `src/lib/api.ts`: `api`, `auth`, `seat`, `admin`, `course`, `stats`
- Base URL from `VITE_API_URL` environment variable (defaults to `http://localhost:5000/api`)

**Authentication Flow**:
- `AuthContext` manages user state and authentication
- `AuthService` handles login/register/logout with token management
- `ProtectedRoute` and `GuestRoute` components enforce access control
- User data transformed to match backend Mongoose schema (handles `_id` → `id` conversion)

**UI Components**:
- Uses Radix UI components (accordion, toast, tooltip, slot)
- Tailwind CSS for styling with custom animations
- TanStack React Table for data tables
- Lucide React for icons

### Backend Architecture

**Directory Structure**:
- `src/server.ts` - Express app setup with CORS, routes, and database connection
- `src/config/` - Configuration (MongoDB connection via Mongoose)
- `src/controllers/` - Request handlers (auth, admin, seat)
- `src/routes/` - Express route definitions
- `src/middleware/` - Express middleware (authentication, upload limiting)
- `src/models/` - Mongoose schemas (User, Seat, Reservation, CheckIn)
- `src/types/` - TypeScript type definitions
- `src/utils/` - Utility functions (JWT generation, file naming, seeding)

**Database**:
- MongoDB with Mongoose ODM
- Connection via `MONGO_URI` environment variable
- Models use Mongoose schemas with virtual fields and JSON transformations
- User model transforms `_id` to `id` in JSON output

**Authentication**:
- JWT-based with Bearer tokens
- `authenticate` middleware validates tokens
- Password hashing with bcryptjs
- First user registered becomes admin, others default to "shifty" role

**API Routes**:
- `/api/auth` - Login, register, validate, get/update user
- `/api/admin` - Admin operations
- `/api/seat` - Seat and reservation management

**CORS Configuration**:
- Origin: `process.env.CLIENT_URL`
- Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
- Credentials enabled
- Custom headers allowed

---

## Environment Variables

### Frontend (`.env` or `.env.local`)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (`.env`)
```
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://...
JWT_SECRET=your-secret-key
```

---

## Common Development Tasks

### Adding a New API Endpoint

1. **Create controller** in `backend/src/controllers/` with request handler
2. **Add route** in `backend/src/routes/` and mount in `server.ts`
3. **Create service** in `frontend/src/services/` to call the endpoint
4. **Add interface** in `frontend/src/interfaces/` for request/response types
5. **Use in component** via the service and context/hooks

### Adding a New Page

1. Create page component in `frontend/src/pages/`
2. Add route in `frontend/src/App.tsx`
3. Wrap with `ProtectedRoute` or `GuestRoute` as needed
4. Create layout component in `frontend/src/components/layout/` if needed

### Modifying User Model

- Backend: Update `backend/src/models/User.ts` (Mongoose schema)
- Frontend: Update `frontend/src/interfaces/models/IUser.ts` to match
- Ensure JSON transformation in User model handles new fields correctly

### Running Tests

Currently no test scripts configured. Add Jest/Vitest configuration when needed.

---

## Important Implementation Details

### User Role System
- Roles: `"admin"`, `"shifty"`, `"cashier"`
- First registered user automatically becomes admin
- Subsequent users default to "shifty" unless specified
- Frontend transforms user data to handle both `_id` and `id` fields

### Token Management
- Tokens stored in `sessionStorage` (not localStorage) for security
- Axios interceptor automatically adds `Authorization: Bearer {token}` header
- 401 responses trigger redirect to login (handled in interceptor)

### Data Transformation
- Backend Mongoose models use virtual fields and JSON transforms
- Frontend AuthContext transforms user data: `_id` → `id`, removes password
- Services handle API response transformation

### File Upload
- Uses multer for file handling
- S3 integration available via `@aws-sdk/s3-request-presigner`
- Upload limiter middleware prevents abuse

---

## Debugging Tips

- **Backend**: Check console logs with colored output (🚀, ✅, ❌ emojis)
- **Frontend**: Use browser DevTools, check sessionStorage for token
- **API Issues**: Verify `VITE_API_URL` and `CLIENT_URL` environment variables
- **Auth Issues**: Check token in sessionStorage and JWT_SECRET in backend
- **CORS Issues**: Verify CLIENT_URL matches frontend origin in backend CORS config

---

## Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend UI | React 19, TypeScript, Vite |
| Frontend Styling | Tailwind CSS, Radix UI |
| Frontend State | React Context API |
| Frontend HTTP | Axios |
| Frontend Routing | React Router v7 |
| Backend Framework | Express 5 |
| Backend Language | TypeScript |
| Database | MongoDB + Mongoose |
| Authentication | JWT + bcryptjs |
| File Upload | Multer, AWS S3 |
| AI Integration | Google GenAI SDK |
