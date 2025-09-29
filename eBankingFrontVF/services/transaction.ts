import apiClient from "@/api/apiClient";

export async function createTransaction(payload: any) {
  const res = await apiClient.post("/transaction", payload);
  return res.data;
}

export async function getTransactions(params: any = {}) {
  const res = await apiClient.get("/transaction", { params });
  return res.data;
}

export async function getTransactionStats(params: any = {}) {
  const res = await apiClient.get("/transaction/stats", { params });
  return res.data;
}

export async function getTransactionById(id: string) {
  const res = await apiClient.get(`/transaction/${id}`);
  return res.data;
}

export async function updateTransaction(id: string, payload: any) {
  const res = await apiClient.put(`/transaction/${id}`, payload);
  return res.data;
}

export async function deleteTransaction(id: string) {
  const res = await apiClient.delete(`/transaction/${id}`);
  return res.data;
}

// Specific deposit functions
export async function createDeposit(payload: {
  cardId?: string;
  amount: number;
  currency?: string;
  description?: string;
  category?: string;
  location?: string;
}) {
  const depositPayload = {
    ...payload,
    type: "deposit",
    currency: payload.currency || "USD",
    description: payload.description || "Account Deposit",
    category: payload.category || "other"
  };
  
  const res = await apiClient.post("/transaction", depositPayload);
  return res.data;
}

export async function getDepositHistory(params: any = {}) {
  const depositParams = {
    ...params,
    type: "deposit"
  };
  
  const res = await apiClient.get("/transaction", { params: depositParams });
  return res.data;
}
