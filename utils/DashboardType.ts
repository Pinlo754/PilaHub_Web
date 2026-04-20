export type CoachType = {
  name: string;
  avgRating: number;
};

export type GrossMonthType = {
  month: number;
  totalGross: number;
};

export type DashboardType = {
  totalTrainees: number;
  totalVendors: number;
  totalCoaches: number;
  transactionsToday: number;
  totalGrossMonthly: number;
  grossMonthlyOfYear: GrossMonthType[];
  coachesByAvgRating: CoachType[];
};
