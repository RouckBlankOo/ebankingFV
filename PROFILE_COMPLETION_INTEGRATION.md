# Profile Completion API Integration

## Overview

This document describes the complete profile functionality integration between the backend and frontend applications.

## Backend API Endpoints

### 1. Complete Profile (`PUT /api/user/complete-profile`)

**Purpose**: Complete user's basic profile information
**Authentication**: Required (JWT token)
**Content-Type**: `multipart/form-data` (supports file upload)

**Request Body**:

```javascript
{
  username: string (required),
  firstName: string (required),
  lastName: string (required),
  dateOfBirth: string (required, YYYY-MM-DD format),
  email: string (required),
  profilePicture: File (optional, image file)
}
```

**Response**:

```javascript
{
  message: "Profile completed successfully",
  user: {
    username: string,
    email: string,
    personalInfo: {
      firstName: string,
      lastName: string,
      dateOfBirth: Date,
      profilePicture: string
    }
  }
}
```

### 2. Complete Address (`PUT /api/user/complete-address`)

**Purpose**: Complete user's address information
**Authentication**: Required (JWT token)
**Content-Type**: `application/json`

**Request Body**:

```javascript
{
  country: string (required),
  streetAddress: string (required),
  addressLine2: string (optional),
  city: string (required),
  postalCode: string (required),
  state: string (required)
}
```

**Response**:

```javascript
{
  message: "Address information updated successfully",
  address: {
    country: string,
    streetAddress: string,
    addressLine2: string,
    city: string,
    postalCode: string,
    state: string
  }
}
```

### 3. Complete KYC Data (`PUT /api/user/complete-kyc`)

**Purpose**: Complete user's KYC (Know Your Customer) verification
**Authentication**: Required (JWT token)
**Content-Type**: `multipart/form-data` (supports multiple file uploads)

**Request Body**:

```javascript
{
  documentType: string (required, enum: "passport", "driving_license", "national_id_card"),
  documentNumber: string (required),
  issuingCity: string (required),
  nationality: string (required),
  expiryDate: string (optional, YYYY-MM-DD format),
  passport: File (optional, for passport type),
  front: File (optional, for ID cards/licenses),
  back: File (optional, for ID cards/licenses)
}
```

**Response**:

```javascript
{
  message: "KYC data completed successfully",
  kycVerification: {
    documentType: string,
    documentNumber: string,
    issuingCity: string,
    nationality: string,
    expiryDate: Date,
    documentPhotos: {
      passport: string,
      front: string,
      back: string
    }
  }
}
```

## Frontend Integration

### Service Methods (`services/user.ts`)

1. **`completeProfile(payload)`** - Calls `/api/user/complete-profile`
2. **`completeAddress(payload)`** - Calls `/api/user/complete-address`
3. **`completeKycData(payload)`** - Calls `/api/user/complete-kyc`

### Updated Screens

1. **PersonalInformationScreen** (`screens/Profile/PersonalInformationScreen.tsx`)

   - Integrated with `completeProfile` API
   - Added image picker for profile picture
   - Added proper validation and error handling
   - Shows loading state during API calls

2. **AddressInformationScreen** (`screens/Onboarding/AddressInformationScreen.tsx`)

   - Integrated with `completeAddress` API
   - Added proper validation for required fields
   - Shows loading state during API calls

3. **IdentityVerificationScreen** (`screens/Auth/IdentityVerificationScreen.tsx`)
   - Integrated with `completeKycData` API
   - Added image picker for document photos
   - Supports different document types (passport, driving license, national ID)
   - Added proper validation and error handling

### Key Features Added

1. **File Upload Support**:

   - Profile pictures in PersonalInformationScreen
   - Document photos in IdentityVerificationScreen
   - Uses `expo-image-picker` for image selection

2. **Proper Error Handling**:

   - Network error handling
   - Server error messages displayed to user
   - Input validation before API calls

3. **Loading States**:

   - Disabled buttons during API calls
   - Loading indicators for better UX

4. **Data Validation**:
   - Email format validation
   - Date format validation (MM/DD/YYYY converted to YYYY-MM-DD)
   - Required field validation

## Flow Summary

1. **Personal Information**: User enters basic details + uploads profile picture → calls `completeProfile` API
2. **Address Information**: User enters address details → calls `completeAddress` API
3. **Identity Verification**: User selects document type, enters details + uploads photos → calls `completeKycData` API

## Dependencies Added

- `expo-image-picker`: For image selection functionality

## Testing the Integration

1. **Start Backend**:

   ```bash
   cd eBankingBackVF
   npm start
   ```

   Backend runs on http://localhost:4022

2. **Start Frontend**:

   ```bash
   cd eBankingFrontVF
   npm start
   ```

3. **Test Flow**:
   - Register/Login to get authentication token
   - Navigate through profile completion screens
   - Verify API calls are made and data is saved to database

## Backend Dependencies

The backend uses:

- `multer` for file upload handling
- MongoDB for data storage
- JWT for authentication
- Express.js for API routing

## Database Schema

User data is stored in MongoDB with the following structure:

- `personalInfo`: firstName, lastName, dateOfBirth, profilePicture, countryOfResidence
- `address`: country, streetAddress, addressLine2, city, postalCode, state
- `kycVerification`: documentType, documentNumber, issuingCity, nationality, expiryDate, documentPhotos

All uploaded files are stored in the backend's file system with paths saved in the database.
