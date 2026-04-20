"use client";

import { useEffect, useState } from "react";
import { CreateEquipmentReq, EquipmentType } from "@/utils/EquipmentType";
import { EquipmentService } from "@/hooks/equipment.service";
import { useToast } from "@/hooks/useToast";
import { useConfirm } from "@/hooks/useConfirm";

const PAGE_SIZE = 10;

export const useEquipments = () => {
  const [equipments, setEquipments] = useState<EquipmentType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEquipment, setSelectedEquipment] =
    useState<EquipmentType | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { toasts, removeToast, showSuccess, showError } = useToast();
  const { confirmState, isConfirmOpen, confirm, closeConfirm } = useConfirm();

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const res = await EquipmentService.getAll();
      setEquipments(res);
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data: CreateEquipmentReq): Promise<void> => {
    try {
      await EquipmentService.createEquipment(data);
      showSuccess("Tạo thiết bị thành công");
      await fetchAll();
      setCurrentPage(1);
    } catch (err: any) {
      showError(err?.message ?? "Tạo thiết bị thất bại");
      throw err;
    }
  };

  const handleUpdate = async (
    equipmentId: string,
    data: Partial<CreateEquipmentReq>,
  ): Promise<void> => {
    try {
      await EquipmentService.updateEquipment(equipmentId, data);
      showSuccess("Cập nhật thiết bị thành công");
      await fetchAll();
      setCurrentPage(1);
    } catch (err: any) {
      showError(err?.message ?? "Cập nhật thiết bị thất bại");
      throw err;
    }
  };

  const handleDelete = (equipmentId: string, name: string) => {
    confirm({
      title: "Xoá thiết bị",
      description: `Bạn có chắc muốn xoá thiết bị "${name}"? Hành động này không thể hoàn tác.`,
      confirmLabel: "Xoá",
      variant: "danger",
      onConfirm: async () => {
        try {
          await EquipmentService.deleteEquipment(equipmentId);
          showSuccess("Xoá thiết bị thành công");
          await fetchAll();
          setCurrentPage(1);
        } catch (err: any) {
          showError(err?.message ?? "Xoá thiết bị thất bại");
        }
      },
    });
  };

  // ── PAGINATION / FILTER ───────────────────────────────────────────────────
  const filtered = equipments.filter((e) =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // ── MODALS ────────────────────────────────────────────────────────────────
  const openDetailModal = (equipment: EquipmentType) => {
    setSelectedEquipment(equipment);
    setShowDetailModal(true);
  };
  const closeDetailModal = () => {
    setSelectedEquipment(null);
    setShowDetailModal(false);
  };

  const openCreateModal = () => setShowCreateModal(true);
  const closeCreateModal = () => setShowCreateModal(false);

  useEffect(() => {
    fetchAll();
  }, []);

  return {
    // data
    equipments,
    paginated,
    isLoading,
    // search & pagination
    searchTerm,
    setSearchTerm,
    currentPage: safePage,
    totalPages,
    handlePageChange,
    // actions
    handleCreate,
    handleDelete,
    // detail modal
    selectedEquipment,
    showDetailModal,
    openDetailModal,
    closeDetailModal,
    // create modal
    showCreateModal,
    openCreateModal,
    closeCreateModal,
    // toast & confirm
    toasts,
    removeToast,
    confirmState,
    isConfirmOpen,
    closeConfirm,
    handleUpdate,
  };
};
