import { useEffect, useState, useRef } from "react";
import { BodyPartService } from "@/hooks/bodyPart.service";
import {
  BodyPartType,
  CreateBodyPartReq,
  UpdateBodyPartReq,
} from "@/utils/BodyPartType";
import { useToast } from "@/hooks/useToast";
import { useConfirm } from "@/hooks/useConfirm";

export const useBodyParts = () => {
  const PAGE_SIZE = 11;
  const DEBOUNCE_MS = 500;

  const [bodyParts, setBodyParts] = useState<BodyPartType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPartType | null>(
    null,
  );
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { toasts, removeToast, showSuccess, showError } = useToast();
  const { confirmState, isConfirmOpen, confirm, closeConfirm } = useConfirm();

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch all (không search)
  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const res = await BodyPartService.getAll();
      setBodyParts(res);
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setIsLoading(false);
    }
  };

  // Search by name
  const fetchByName = async (name: string) => {
    setIsLoading(true);
    try {
      const res = await BodyPartService.searchByName(name);
      setBodyParts(res);
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra khi tìm kiếm");
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce search
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (value.trim() === "") {
        fetchAll();
      } else {
        fetchByName(value.trim());
      }
    }, DEBOUNCE_MS);
  };

  const createBodyPart = async (payload: CreateBodyPartReq) => {
    setIsLoading(true);
    try {
      await BodyPartService.createBodyPart(payload);
      showSuccess("Thêm bộ phận thành công");
      setShowCreateModal(false);
      // Refresh theo đúng state hiện tại
      if (searchTerm.trim()) {
        await fetchByName(searchTerm.trim());
      } else {
        await fetchAll();
      }
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra khi thêm");
    } finally {
      setIsLoading(false);
    }
  };

  const updateBodyPart = async (payload: UpdateBodyPartReq) => {
    if (!selectedBodyPart) return;
    setIsLoading(true);
    try {
      await BodyPartService.updateBodyPart(
        selectedBodyPart.bodyPartId,
        payload,
      );
      showSuccess("Cập nhật thành công");
      setShowDetailModal(false);
      if (searchTerm.trim()) {
        await fetchByName(searchTerm.trim());
      } else {
        await fetchAll();
      }
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra khi cập nhật");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBodyPart = (bodyPartId: string, name: string) => {
    confirm({
      title: "Xoá bộ phận?",
      description: `Hành động này sẽ xoá vĩnh viễn "${name}" và không thể hoàn tác.`,
      confirmLabel: "Xoá",
      variant: "danger",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          await BodyPartService.deleteBodyPart(bodyPartId);
          showSuccess("Đã xoá thành công");
          if (searchTerm.trim()) {
            await fetchByName(searchTerm.trim());
          } else {
            await fetchAll();
          }
        } catch (err: any) {
          showError(err?.message ?? "Có lỗi xảy ra khi xoá");
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const openDetailModal = (bodyPart: BodyPartType) => {
    setSelectedBodyPart(bodyPart);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelectedBodyPart(null);
    setShowDetailModal(false);
  };

  // Pagination (client-side trên kết quả trả về từ API)
  const totalPages = Math.max(1, Math.ceil(bodyParts.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const paginated = bodyParts.slice(startIndex, startIndex + PAGE_SIZE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    fetchAll();
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return {
    isLoading,
    searchTerm,
    setSearchTerm: handleSearchChange,
    currentPage: safePage,
    totalPages,
    handlePageChange,
    paginated,
    startIndex,
    selectedBodyPart,
    showDetailModal,
    showCreateModal,
    setShowCreateModal,
    openDetailModal,
    closeDetailModal,
    createBodyPart,
    updateBodyPart,
    deleteBodyPart,
    toasts,
    removeToast,
    confirmState,
    isConfirmOpen,
    closeConfirm,
  };
};
