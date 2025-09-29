import apiClient from "@/api/apiClient";

export async function createCard(payload: any) {
  const res = await apiClient.post("/cards", payload);
  return res.data;
}

export async function getCards() {
  const res = await apiClient.get("/cards");
  return res.data;
}

export async function getCard(id: string) {
  const res = await apiClient.get(`/cards/${id}`);
  return res.data;
}

export async function updateCard(id: string, payload: any) {
  const res = await apiClient.put(`/cards/${id}`, payload);
  return res.data;
}

export async function deleteCard(id: string) {
  const res = await apiClient.delete(`/cards/${id}`);
  return res.data;
}
