import apiClient from "@/api/apiClient";

export async function health() {
  const res = await apiClient.get("/health");
  return res.data;
}
