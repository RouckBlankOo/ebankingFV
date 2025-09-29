import apiClient from "@/api/apiClient";

export interface BankTransferData {
  amount: number;
  currency: string;
  recipientName: string;
  recipientAccountNumber: string;
  bankName?: string;
  ribNumber?: string;
  description?: string;
  note?: string;
}

export async function createBankTransfer(payload: BankTransferData) {
  const res = await apiClient.post("/bankTransfer", payload);
  return res.data;
}

export async function getUserTransfers(params: any = {}) {
  const res = await apiClient.get("/bankTransfer", { params });
  return res.data;
}

export async function getBankTransfer(id: string) {
  const res = await apiClient.get(`/bankTransfer/${id}`);
  return res.data;
}

export async function updateBankTransfer(id: string, payload: any) {
  const res = await apiClient.put(`/bankTransfer/${id}`, payload);
  return res.data;
}

export async function deleteBankTransfer(id: string) {
  const res = await apiClient.delete(`/bankTransfer/${id}`);
  return res.data;
}
