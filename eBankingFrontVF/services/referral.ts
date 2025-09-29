import apiClient from "@/api/apiClient";

export async function createReferral(payload: any) {
  const res = await apiClient.post("/referral", payload);
  return res.data;
}

export async function getReferralsByReferrer(userId: string) {
  const res = await apiClient.get(`/referral/referrer/${userId}`);
  return res.data;
}

export async function getReferralsByReferred(userId: string) {
  const res = await apiClient.get(`/referral/referred/${userId}`);
  return res.data;
}

export async function getReferral(id: string) {
  const res = await apiClient.get(`/referral/${id}`);
  return res.data;
}

export async function updateReferral(id: string, payload: any) {
  const res = await apiClient.put(`/referral/${id}`, payload);
  return res.data;
}

export async function deleteReferral(id: string) {
  const res = await apiClient.delete(`/referral/${id}`);
  return res.data;
}
