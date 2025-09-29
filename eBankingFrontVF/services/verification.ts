import apiClient from "@/api/apiClient";

export async function sendVerification(payload: { userId?: string; phoneNumber?: string; email?: string; type: "email" | "phone" }) {
  const res = await apiClient.post("/verification/send-verification", payload);
  return res.data;
}

export async function verifyCode(payload: { userId: string; code: string; type: string }) {
  const res = await apiClient.post("/verification/verify-code", payload);
  return res.data;
}

export async function verifyCodeAttempt(payload: { userId: string; code: string; type: string }) {
  const res = await apiClient.post("/verification/verify-code-attempt", payload);
  return res.data;
}

export async function getVerificationStatus(userId: string) {
  const res = await apiClient.get(`/verification/status/${userId}`);
  return res.data;
}

export async function clearPendingVerifications(userId: string) {
  const res = await apiClient.delete(`/verification/clear/${userId}`);
  return res.data;
}
