import apiClient from "@/api/apiClient";

export async function createCryptoWallet(payload: any) {
  const res = await apiClient.post("/cryptoWallet", payload);
  return res.data;
}

export async function getUserWallets(userId: string) {
  const res = await apiClient.get(`/cryptoWallet/user/${userId}`);
  return res.data;
}

export async function getCryptoWallet(id: string) {
  const res = await apiClient.get(`/cryptoWallet/${id}`);
  return res.data;
}

export async function updateCryptoWallet(id: string, payload: any) {
  const res = await apiClient.put(`/cryptoWallet/${id}`, payload);
  return res.data;
}

export async function deleteCryptoWallet(id: string) {
  const res = await apiClient.delete(`/cryptoWallet/${id}`);
  return res.data;
}
