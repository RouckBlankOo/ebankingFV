import apiClient from "@/api/apiClient";

export async function createAchievement(payload: any) {
  const res = await apiClient.post("/achievement", payload);
  return res.data;
}

export async function getAchievementsForUser(userId: string) {
  const res = await apiClient.get(`/achievement/user/${userId}`);
  return res.data;
}

export async function getAchievement(id: string) {
  const res = await apiClient.get(`/achievement/${id}`);
  return res.data;
}

export async function updateAchievement(id: string, payload: any) {
  const res = await apiClient.put(`/achievement/${id}`, payload);
  return res.data;
}

export async function deleteAchievement(id: string) {
  const res = await apiClient.delete(`/achievement/${id}`);
  return res.data;
}
