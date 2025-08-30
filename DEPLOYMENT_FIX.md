# Deployment Fix for 401 Authentication Errors

## Problem
The 401 authentication errors in production are caused by cross-domain cookie issues between your Vercel frontend and backend deployment.

## Solution Implemented
I've updated the authentication system to support both cookie-based auth (development) and token-based auth (production).

## Required Environment Variables

### Frontend (Vercel)
Set this environment variable in your Vercel project settings:
```
VITE_BACKEND_URL=https://your-backend-domain.com/api
```

### Backend (Your hosting platform)
Set these environment variables:
```
CLIENT_URL=https://devnovate-blogs-eta.vercel.app
NODE_ENV=production
JWT_SECRET=your-jwt-secret-key
```

## Key Changes Made

### Backend Changes:
1. **Updated auth middleware** to accept both cookies and Authorization headers
2. **Modified login/register endpoints** to send tokens in response for production
3. **Updated CORS configuration** to handle production domains properly

### Frontend Changes:
1. **Created token service** for localStorage-based token management
2. **Updated API client** to automatically add Authorization headers
3. **Modified all API calls** to use the new centralized API client
4. **Updated login/logout flows** to handle tokens properly

## How It Works

### Development Mode:
- Uses cookies for authentication (same domain)
- All existing functionality remains the same

### Production Mode:
- Login/register returns JWT token in response
- Token is stored in localStorage
- All API requests include Authorization header
- Logout clears the stored token

## Files Modified:
- `server/controllers/authController.js` - Token in response for production
- `server/middleware/authMiddleware.js` - Accept both cookies and headers
- `server/middleware/optionalAuthMiddleware.js` - Accept both auth methods
- `client/src/services/tokenService.ts` - Token management
- `client/src/services/apiClient.ts` - Centralized API client
- `client/src/services/authService.ts` - Updated auth functions
- `client/src/pages/Login.tsx` - Use new auth service
- `client/src/components/Header.tsx` - Use new logout
- `client/src/pages/Write.tsx` - Use new API client
- `client/src/pages/BlogPost.tsx` - Use new API client
- `client/src/pages/TrendingPage.tsx` - Use new API client

## Next Steps:
1. Set the environment variables in your deployment platforms
2. Redeploy both frontend and backend
3. Test login/logout functionality in production
4. Verify that article submission works

The 401 errors should be resolved after these changes and proper environment variable configuration.
