type MatchesHost = {
  id: string;
  fullName?: string;
  profileImage?: string;
  isVerifiedBadge?: boolean;
};

export type MatchesTravelPlan = {
  id: string;
  title?: string;
  destination: string;
  startDate: string;
  endDate: string;
  host: MatchesHost;
};
export type MatchedPlan = {
  id: string;
  destination: string;
  travelType: string;
  host: {
    id: string;
    fullName?: string;
    profileImage?: string;
    isVerifiedBadge?: boolean;
  };
};

export type MatchesByPlan = Record<string, MatchedPlan[]>;