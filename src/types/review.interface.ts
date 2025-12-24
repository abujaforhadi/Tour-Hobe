export type ReviewPage = {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  author: {
    fullName?: string;
    email?: string;
  };
  target: {
    fullName?: string;
    email?: string;
  };
};


type ReviewHost = {
  id: string;
  fullName?: string;
  profileImage?: string;
};

export type ReviewTravelPlan = {
  id: string;
  title?: string;
  destination: string;
  startDate: string;
  endDate: string;
  host: ReviewHost;
};