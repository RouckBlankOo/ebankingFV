import apiClient from "@/api/apiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "authToken";
const REFRESH_KEY = "refreshToken";

export async function register(payload: { fullName: string; email: string; phoneNumber: string; password: string }) {
  const res = await apiClient.post("/auth/register", payload);
  return res.data;
}

export async function login(payload: { email: string; password: string }) {
  const res = await apiClient.post("/auth/login", payload);
  if (res.data?.token) {
    await AsyncStorage.setItem(TOKEN_KEY, res.data.token);
    if (res.data.refreshToken) await AsyncStorage.setItem(REFRESH_KEY, res.data.refreshToken);
  }
  return res.data;
}

export async function verifyEmail(payload: { userId: string; code: string }) {
  const res = await apiClient.post("/auth/verify-email", payload);
  return res.data;
}

export async function verifyPhone(payload: { userId: string; code: string }) {
  const res = await apiClient.post("/auth/verify-phone", payload);
  return res.data;
}

export async function resendVerification(payload: { userId: string; type: "email" | "phone" }) {
  const res = await apiClient.post("/auth/resend-verification", payload);
  return res.data;
}

export async function forgotPassword(payload: { email: string }) {
  const res = await apiClient.post("/auth/forgot-password", payload);
  return res.data;
}

export async function resetPassword(payload: { email: string; code: string; newPassword: string }) {
  const res = await apiClient.post("/auth/reset-password", payload);
  return res.data;
}

export async function logout(payload?: { refreshToken?: string }) {
  try {
    const res = await apiClient.post("/auth/logout", payload ?? {});
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(REFRESH_KEY);
    return res.data;
  } catch (e) {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(REFRESH_KEY);
    throw e;
  }
}

export async function me() {
  const res = await apiClient.get("/auth/me");
  return res.data;
}
