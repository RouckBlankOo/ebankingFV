import apiClient from "@/api/apiClient";

export async function createNotification(payload: any) {
  const res = await apiClient.post("/notification", payload);
  return res.data;
}

export async function getNotificationsForUser(userId: string) {
  const res = await apiClient.get(`/notification/user/${userId}`);
  return res.data;
}

export async function getNotification(id: string) {
  const res = await apiClient.get(`/notification/${id}`);
  return res.data;
}

export async function updateNotification(id: string, payload: any) {
  const res = await apiClient.put(`/notification/${id}`, payload);
  return res.data;
}

export async function deleteNotification(id: string) {
  const res = await apiClient.delete(`/notification/${id}`);
  return res.data;
}
