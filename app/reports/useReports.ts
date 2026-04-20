import { useEffect, useState } from "react";
import { LiveSessionReportType } from "@/utils/LiveSessionReportType";
import { LiveSessionReportService } from "@/hooks/liveSessionReport.service";
import { TraineeService } from "@/hooks/trainee.service";
import { CoachService } from "@/hooks/coach.service";
import { TraineeType } from "@/utils/TraineeType";
import { CoachType } from "@/utils/CoachType";
import { useToast } from "@/hooks/useToast";
import { useConfirm } from "@/hooks/useConfirm";
import { AccountType } from "@/utils/AccountType";
import { AccountService } from "@/hooks/account.service";

const PAGE_SIZE = 10;

export const useReports = () => {
  const { showSuccess, showError, toasts, removeToast } = useToast();
  const { confirm, confirmState, isConfirmOpen, closeConfirm } = useConfirm();

  const [reports, setReports] = useState<LiveSessionReportType[]>([]);
  const [traineeMap, setTraineeMap] = useState<Record<string, TraineeType>>({});
  const [coachMap, setCoachMap] = useState<Record<string, CoachType>>({});
  const [resolverMap, setResolverMap] = useState<Record<string, AccountType>>(
    {},
  );
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] =
    useState<LiveSessionReportType | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [resolveTarget, setResolveTarget] =
    useState<LiveSessionReportType | null>(null);
  const [showResolveModal, setShowResolveModal] = useState(false);

  // API
  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const [reportRes, traineeRes, coachRes] = await Promise.all([
        LiveSessionReportService.getAll(),
        TraineeService.getAll(),
        CoachService.getAll(),
      ]);

      setReports(reportRes);

      setTraineeMap(
        Object.fromEntries(traineeRes.map((t) => [t.traineeId, t])),
      );
      setCoachMap(Object.fromEntries(coachRes.map((c) => [c.coachId, c])));

      const resolverIds = [
        ...new Set(
          reportRes.map((r) => r.resolvedBy).filter(Boolean) as string[],
        ),
      ];

      const resolverAccounts = await Promise.all(
        resolverIds.map((id) => AccountService.getById(id)),
      );

      setResolverMap(
        Object.fromEntries(resolverAccounts.map((a) => [a.accountId, a])),
      );
    } catch (err: any) {
      showError(err?.type === "BUSINESS_ERROR" ? err.message : "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  const resolveReport = (liveSessionId: string, internalNote: string) => {
    confirm({
      title: "Xác nhận xử lý báo cáo?",
      description: "Báo cáo này sẽ được đánh dấu là đã xử lý.",
      confirmLabel: "Xác nhận",
      variant: "info",
      onConfirm: async () => {
        closeDetailModal();
        setIsLoading(true);
        try {
          await LiveSessionReportService.resolveReport(liveSessionId, {
            internalNote,
          });
          await fetchAll();
          showSuccess("Đã xử lý báo cáo thành công");
        } catch (err: any) {
          showError(
            err?.type === "BUSINESS_ERROR" ? err.message : "Có lỗi xảy ra",
          );
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const openResolveModal = (report: LiveSessionReportType) => {
    setResolveTarget(report);
    setShowResolveModal(true);
  };

  const closeResolveModal = () => {
    setResolveTarget(null);
    setShowResolveModal(false);
  };

  const openDetailModal = (report: LiveSessionReportType) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelectedReport(null);
    setShowDetailModal(false);
  };

  // PAGINATION
  const filtered = reports.filter((r) => {
    const trainee = traineeMap[r.reporterId];
    const coach = coachMap[r.reportedUserId];
    const term = searchTerm.toLowerCase();
    return (
      r.liveSessionId.toLowerCase().includes(term) ||
      trainee?.fullName.toLowerCase().includes(term) ||
      coach?.fullName.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return {
    reports,
    paginated,
    traineeMap,
    coachMap,
    resolverMap,
    isLoading,
    searchTerm,
    setSearchTerm,
    currentPage: safePage,
    totalPages,
    handlePageChange,
    selectedReport,
    showDetailModal,
    openDetailModal,
    closeDetailModal,
    resolveTarget,
    showResolveModal,
    openResolveModal,
    closeResolveModal,
    resolveReport,
    confirmState,
    isConfirmOpen,
    closeConfirm,
    toasts,
    removeToast,
  };
};
