export type Host = {
  id: string;
  fullName?: string;
  profileImage?: string;
  isVerifiedBadge?: boolean;
};

export type TravelPlan = {
  id: string;
  title?: string;
  destination: string;
  startDate: string;
  endDate: string;
  host: Host;
};