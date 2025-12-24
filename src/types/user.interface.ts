export type Role = "USER" | "ADMIN";
export type PaymentStatus = "PENDING" | "PAID" | "UNPAID" | "FAILED" | "REFUNDED";

export interface IUser {
  id: string;
  email: string;
  fullName?: string | null;
  profileImage?: string | null;
  bio?: string | null;
  travelInterests?: string[];
  visitedCountries?: string[];
  currentLocation?: string | null;
  role?: Role;
  isPremium?: boolean;
  createdAt: string;
  updatedAt: string;
  paymentStatus?: PaymentStatus;
  premiumExpiresAt?: string | null;
}