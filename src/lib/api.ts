/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosClient } from "./baseApi";



export const AuthAPI = {
  login: (payload: any) => axiosClient.post("/auth/login", payload),
  register: (payload: any) => axiosClient.post("/auth/register", payload),
  me: () => axiosClient.get("/user/me"),
  logout: () => axiosClient.post("/auth/logout")
};

export const UserAPI = {
  getProfile: (id: string) => axiosClient.get(`/user/${id}`),
  updateProfile: (id: string, payload: any) => axiosClient.patch(`/user/${id}`, payload),
  listUsers: (params?: any) => axiosClient.get("/user", { params }),
   deleteUser: (id: string) => axiosClient.delete(`/user/${id}`),
   changeRole: (id: string, role: "USER" | "ADMIN") =>axiosClient.patch(`/user/${id}/role`, { role }),
};

export const PlansAPI = {
  create: (payload: any) => axiosClient.post("/travel-plans", payload),
  list: (params?: any) => axiosClient.get("/travel-plans", { params }),
  get: (id: string) => axiosClient.get(`/travel-plans/${id}`),
  update: (id: string, payload: any) => axiosClient.patch(`/travel-plans/${id}`, payload),
  remove: (id: string) => axiosClient.delete(`/travel-plans/${id}`),
  
};

export const ReviewAPI = {
  add: (payload: any) => axiosClient.post("/reviews", payload),
  update: (id: string, payload: any) => axiosClient.patch(`/reviews/${id}`, payload),
  remove: (id: string) => axiosClient.delete(`/reviews/${id}`)
};

export const PaymentAPI = {
  initSubscription: (payload: any) => axiosClient.post("/payments/init-subscription", payload),
  status: (transactionId: string) => axiosClient.get(`/payments/status/${transactionId}`),
  adminTransactions: (params?: any) => axiosClient.get("/payments/admin/transactions", { params })
};
