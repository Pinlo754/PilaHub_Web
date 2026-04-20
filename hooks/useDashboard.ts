import { useEffect, useState } from "react";
import { DashboardType } from "@/utils/DashboardType";
import { useToast } from "@/hooks/useToast";
import { DashboardAdminService } from "./dashboardAdmin.service";

export const useDashboard = () => {
  const [dashboard, setDashboard] = useState<DashboardType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toasts, removeToast, showError } = useToast();

  const fetchDashboard = async () => {
    setIsLoading(true);
    try {
      const res = await DashboardAdminService.getDashboard();
      setDashboard(res);
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return {
    dashboard,
    isLoading,
    fetchDashboard,
    toasts,
    removeToast,
  };
};
