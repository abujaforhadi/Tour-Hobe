import { ITravelPlan } from "./travelPlan.interface";

export type MatchPlanCommon = ITravelPlan & {
  host: {
    id: string;
    fullName?: string;
    profileImage?: string;
    isVerifiedBadge?: boolean;
    currentLocation?: string | null;
  };
};