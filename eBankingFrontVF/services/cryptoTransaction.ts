import apiClient from "@/api/apiClient";

export async function createCryptoTransaction(payload: any) {
  const res = await apiClient.post("/cryptoTransaction", payload);
  return res.data;
}

export async function getUserCryptoTransactions(userId: string) {
  const res = await apiClient.get(`/cryptoTransaction/user/${userId}`);
  return res.data;
}

export async function getCryptoTransaction(id: string) {
  const res = await apiClient.get(`/cryptoTransaction/${id}`);
  return res.data;
}

export async function updateCryptoTransaction(id: string, payload: any) {
  const res = await apiClient.put(`/cryptoTransaction/${id}`, payload);
  return res.data;
}

export async function deleteCryptoTransaction(id: string) {
  const res = await apiClient.delete(`/cryptoTransaction/${id}`);
  return res.data;
}
