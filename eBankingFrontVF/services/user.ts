import apiClient from "@/api/apiClient";

export async function getProfile() {
  const res = await apiClient.get("/user/profile");
  return res.data;
}

export async function updateProfile(payload: { fullName?: string; phoneNumber?: string }) {
  const res = await apiClient.put("/user/profile", payload);
  return res.data;
}

// Complete Profile API - matches backend /user/complete-profile
export async function completeProfile(payload: {
  username: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  profilePicture?: any; // File or image
}) {
  const formData = new FormData();
  formData.append('username', payload.username);
  formData.append('firstName', payload.firstName);
  formData.append('lastName', payload.lastName);
  formData.append('dateOfBirth', payload.dateOfBirth);
  formData.append('email', payload.email);
  
  if (payload.profilePicture) {
    formData.append('profilePicture', payload.profilePicture);
  }

  const res = await apiClient.put("/user/complete-profile", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
}

// Complete Address API - matches backend /user/complete-address
export async function completeAddress(payload: {
  country: string;
  streetAddress: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  state: string;
}) {
  const res = await apiClient.put("/user/complete-address", payload);
  return res.data;
}

// Complete KYC API - matches backend /user/complete-kyc
export async function completeKycData(payload: {
  documentType: 'passport' | 'driving_license' | 'national_id_card';
  documentNumber: string;
  issuingCity: string;
  nationality: string;
  expiryDate?: string;
  passport?: any; // File
  front?: any; // File
  back?: any; // File
}) {
  const formData = new FormData();
  formData.append('documentType', payload.documentType);
  formData.append('documentNumber', payload.documentNumber);
  formData.append('issuingCity', payload.issuingCity);
  formData.append('nationality', payload.nationality);
  
  if (payload.expiryDate) {
    formData.append('expiryDate', payload.expiryDate);
  }
  
  if (payload.passport) {
    formData.append('passport', payload.passport);
  }
  
  if (payload.front) {
    formData.append('front', payload.front);
  }
  
  if (payload.back) {
    formData.append('back', payload.back);
  }

  const res = await apiClient.put("/user/complete-kyc", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
}

// Update Country of Residence API - matches backend /user/update-cor
export async function updateCountryOfResidence(payload: { countryOfResidence: string }) {
  const res = await apiClient.post("/user/update-cor", payload);
  return res.data;
}

// Update Push Notification Preference API - matches backend /user/update-push-preference
export async function updatePushNotificationPreference() {
  const res = await apiClient.post("/user/update-push-preference");
  return res.data;
}

// Legacy methods for backward compatibility
export async function updatePersonalInfo(payload: any) {
  // Map to completeProfile for compatibility
  return await completeProfile(payload);
}

export async function updateAddressInfo(payload: any) {
  // Map to completeAddress for compatibility
  return await completeAddress(payload);
}

export async function submitIdentityVerification(payload: any) {
  // Map to completeKycData for compatibility
  return await completeKycData(payload);
}

export async function changePassword(payload: { currentPassword: string; newPassword: string }) {
  const res = await apiClient.put("/user/change-password", payload);
  return res.data;
}

export async function deleteAccount(payload: { password: string; confirmDeletion: string }) {
  const res = await apiClient.delete("/user/account", { data: payload });
  return res.data;
}
