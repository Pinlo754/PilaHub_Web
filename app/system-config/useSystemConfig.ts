import { useEffect, useState } from "react";
import { SystemConfigType } from "@/utils/SystemConfigType";
import { SystemConfigService } from "@/hooks/systemConfig.service";
import { useToast } from "@/hooks/useToast";
import { useConfirm } from "@/hooks/useConfirm";
import { UpdateSystemConfigReq } from "@/utils/SystemConfigType";

export const useSystemConfig = () => {
  const [configs, setConfigs] = useState<SystemConfigType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<SystemConfigType | null>(
    null,
  );
  const [showDetailModal, setShowDetailModal] = useState(false);

  const { toasts, removeToast, showSuccess, showError } = useToast();
  const { confirmState, isConfirmOpen, confirm, closeConfirm } = useConfirm();

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const res = await SystemConfigService.getAll();
      setConfigs(res);
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra khi tải cấu hình");
    } finally {
      setIsLoading(false);
    }
  };

  const updateConfig = (configId: string, payload: UpdateSystemConfigReq) => {
    confirm({
      title: "Cập nhật cấu hình?",
      description: "Thay đổi này sẽ ảnh hưởng đến hoạt động của hệ thống.",
      confirmLabel: "Cập nhật",
      variant: "info",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          await SystemConfigService.updateSystemConfig(configId, payload);
          await fetchAll();
          setShowDetailModal(false);
          setSelectedConfig(null);
          showSuccess("Cập nhật cấu hình thành công");
        } catch (err: any) {
          showError(err?.message ?? "Có lỗi xảy ra");
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const openDetailModal = (config: SystemConfigType) => {
    setSelectedConfig(config);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelectedConfig(null);
    setShowDetailModal(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return {
    configs,
    isLoading,
    selectedConfig,
    showDetailModal,
    openDetailModal,
    closeDetailModal,
    updateConfig,
    toasts,
    removeToast,
    confirmState,
    isConfirmOpen,
    closeConfirm,
  };
};
