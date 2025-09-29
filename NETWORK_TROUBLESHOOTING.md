# Network Connection Troubleshooting Guide

## Issue

Getting "Network Error" when trying to complete profile in the frontend.

## Root Causes Identified

### 1. ✅ CORS Configuration Fixed

**Problem**: Backend CORS was only allowing `http://localhost:4022`
**Solution**: Updated CORS to allow Expo development servers:

- `http://localhost:8081` (Expo development server)
- `http://localhost:19000` (Expo development server alternative)
- `http://localhost:19006` (Expo web development)
- `http://10.0.2.2:8081` (Android emulator)
- `http://192.168.100.4:8081` (LAN IP for physical devices)

### 2. ✅ ImagePicker Deprecation Warning Fixed

**Problem**: Using deprecated `ImagePicker.MediaTypeOptions.Images`
**Solution**: Updated to use `mediaTypes: 'images'`

### 3. 🔍 Authentication Required

**Critical**: The `/complete-profile` endpoint requires a valid JWT token.

## Next Steps

### Step 1: Verify User Authentication

Before completing profile, ensure user is authenticated:

```javascript
// Check if user has auth token
const token = await AsyncStorage.getItem("authToken");
console.log("Auth token exists:", !!token);
```

### Step 2: Login/Register First

If no auth token exists, user needs to:

1. Register a new account via `/api/auth/register`
2. Login via `/api/auth/login`
3. Token will be stored automatically

### Step 3: Test Backend Connectivity

Test the backend directly:

```bash
# Test health endpoint
curl http://localhost:4022/api/health

# Test auth endpoint (should work without token)
curl -X POST http://localhost:4022/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"phone":"+1234567890","password":"test123"}'
```

### Step 4: Platform-Specific URLs

- **iOS Simulator**: `http://localhost:4022/api`
- **Android Emulator**: `http://10.0.2.2:4022/api`
- **Physical Device**: `http://[YOUR_LAN_IP]:4022/api`

## Updated Files

1. `eBankingBackVF/server.js` - Updated CORS configuration
2. `eBankingFrontVF/api/apiClient.ts` - Improved URL detection and logging
3. `eBankingFrontVF/screens/Profile/PersonalInformationScreen.tsx` - Fixed ImagePicker deprecation
4. `eBankingFrontVF/screens/Auth/IdentityVerificationScreen.tsx` - Fixed ImagePicker deprecation
5. `eBankingFrontVF/.env` - Added API_BASE_URL environment variable

## Next Action Required

**You need to authenticate first!** The complete profile endpoint requires a valid user session. Please:

1. Navigate to the registration/login screen
2. Create an account or login
3. Then try to complete the profile

The network error occurs because the backend returns 401 Unauthorized for requests without a valid JWT token.
