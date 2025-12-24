export type Payment = {
  id: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: string;
  description?: string;
  paymentGateway: string;
  createdAt: string;
};