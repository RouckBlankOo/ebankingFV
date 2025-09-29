import apiClient from "@/api/apiClient";

export async function createBank(payload: any) {
  const res = await apiClient.post("/bank", payload);
  return res.data;
}

export async function getBanks() {
  const res = await apiClient.get("/bank");
  return res.data;
}

export async function getBank(id: string) {
  const res = await apiClient.get(`/bank/${id}`);
  return res.data;
}

export async function updateBank(id: string, payload: any) {
  const res = await apiClient.put(`/bank/${id}`, payload);
  return res.data;
}

export async function deleteBank(id: string) {
  const res = await apiClient.delete(`/bank/${id}`);
  return res.data;
}
