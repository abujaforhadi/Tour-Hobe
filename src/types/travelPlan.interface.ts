/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ITravelPlan {
  updatedAt: string;
  id: string;
  title?: string;
  destination: string;
  startDate: string;
  endDate: string;
  budgetMin?: number | null;
  budgetMax?: number | null;
  travelType?: string;
  description?: string;
  visibility?: string;
  hostId?: string;
  createdAt?: string;
  host?: {
    id: string;
    email: string;
    fullName?: string | null;
    profileImage?: string | null;
  };
}
export type TravelPlanProps = {
  plans: ITravelPlan[];
  loading: boolean;
  error: string | null;
  actionLoadingId: string | null;
  onView: (plan: ITravelPlan) => void;
  onEdit: (plan: ITravelPlan) => void;
  onDelete: (plan: ITravelPlan) => void;
};
export type TravelFormProps = {
  plan: ITravelPlan;
  onCancel: () => void;
  onSaved: (plan: ITravelPlan) => void;
};

export type TravelFormValues = {
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  budgetMin: string;
  budgetMax: string;
  travelType: ITravelPlan["travelType"];
  description: string;
  visibility: ITravelPlan["visibility"];
};
export type Participant = {
  id: string;
  status: string;
  user: {
    id: string;
    fullName?: string;
    profileImage?: string;
  };
};

export type Review = {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  authorId: string;
  targetId: string;
  author: {
    id: string;
    fullName?: string;
    profileImage?: string;
  };
};

export type Props = {
  planId: string;
  hostId: string;
  planEndDate: string;
   planStartDate: string | null
};

export type UserTravelPlan = {
  id: string;
  title?: string;
  destination: string;
  startDate: string;
  endDate: string;
};
export type PlanPageProps = {
  searchParams: Promise<{
    page?: string;
    destination?: string;
    travelType?: string;
  }>;
};