import apiClient from "@/api/apiClient";

export async function createAddress(payload: any) {
  const res = await apiClient.post("/address", payload);
  return res.data;
}

export async function getAddressesForUser(userId: string) {
  const res = await apiClient.get(`/address/user/${userId}`);
  return res.data;
}

export async function getAddress(id: string) {
  const res = await apiClient.get(`/address/${id}`);
  return res.data;
}

export async function updateAddress(id: string, payload: any) {
  const res = await apiClient.put(`/address/${id}`, payload);
  return res.data;
}

export async function deleteAddress(id: string) {
  const res = await apiClient.delete(`/address/${id}`);
  return res.data;
}
