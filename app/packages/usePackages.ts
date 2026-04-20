import { useEffect, useState } from "react";
import {
  PackageType,
  CreatePackageReq,
  UpdatePackageReq,
} from "@/utils/PackageType";
import { PackageService } from "@/hooks/package.service";
import { useToast } from "@/hooks/useToast";
import { useConfirm } from "@/hooks/useConfirm";

export const usePackages = () => {
  const SIZE = 10;

  // HOOKS
  const { showSuccess, showError, toasts, removeToast } = useToast();
  const { confirm, confirmState, isConfirmOpen, closeConfirm } = useConfirm();

  // STATE
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(
    null,
  );
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // API
  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const res = await PackageService.getAll({ page, size: SIZE });
      setPackages(res.content);
      setTotalPages(res.totalPages);
    } catch (err: any) {
      showError(err?.type === "BUSINESS_ERROR" ? err.message : "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  const createPackage = async (payload: CreatePackageReq) => {
    setIsLoading(true);
    try {
      await PackageService.createPackage(payload);
      await fetchAll();
      setShowCreateModal(false);
      showSuccess("Tạo gói thành công");
    } catch (err: any) {
      showError(err?.type === "BUSINESS_ERROR" ? err.message : "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  const updatePackage = async (
    packageId: string,
    payload: UpdatePackageReq,
  ) => {
    setIsLoading(true);
    try {
      await PackageService.updatePackage(packageId, payload);
      await fetchAll();
      setShowDetailModal(false);
      setSelectedPackage(null);
      showSuccess("Cập nhật gói thành công");
    } catch (err: any) {
      showError(err?.type === "BUSINESS_ERROR" ? err.message : "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatusPackage = (packageId: string, isActive: boolean) => {
    confirm({
      title: isActive ? "Tắt gói dịch vụ?" : "Kích hoạt gói dịch vụ?",
      description: isActive
        ? "Gói này sẽ không còn khả dụng với người dùng."
        : "Gói này sẽ được kích hoạt trở lại.",
      confirmLabel: isActive ? "Tắt" : "Kích hoạt",
      variant: isActive ? "danger" : "info",

      onConfirm: async () => {
        setIsLoading(true);
        try {
          if (isActive) {
            await PackageService.deactivePackage(packageId);
          } else {
            await PackageService.activePackage(packageId);
          }

          await fetchAll();
          showSuccess(isActive ? "Đã tắt gói" : "Đã kích hoạt gói");
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

  // HANDLERS
  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePrevPage = () => setPage((prev) => (prev > 0 ? prev - 1 : 0));

  const openDetailModal = (pkg: PackageType) => {
    setSelectedPackage(pkg);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelectedPackage(null);
    setShowDetailModal(false);
  };

  const openCreateModal = () => setShowCreateModal(true);
  const closeCreateModal = () => setShowCreateModal(false);

  // EFFECTS
  useEffect(() => {
    fetchAll();
  }, [page]);

  return {
    packages,
    isLoading,
    confirmState,
    isConfirmOpen,
    closeConfirm,
    fetchAll,
    searchTerm,
    setSearchTerm,
    handleNextPage,
    handlePrevPage,
    totalPages,
    page,
    selectedPackage,
    showDetailModal,
    openDetailModal,
    closeDetailModal,
    updatePackage,
    updateStatusPackage,
    createPackage,
    openCreateModal,
    closeCreateModal,
    showCreateModal,
    toasts,
    removeToast,
  };
};
