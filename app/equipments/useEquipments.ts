"use client";

import { useEffect, useRef, useState } from "react";
import { CreateEquipmentReq, EquipmentType } from "@/utils/EquipmentType";
import { EquipmentService } from "@/hooks/equipment.service";
import { useToast } from "@/hooks/useToast";
import { useConfirm } from "@/hooks/useConfirm";

const PAGE_SIZE = 10;
const DEBOUNCE_MS = 500;

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
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const fetchByName = async (name: string) => {
    setIsLoading(true);
    try {
      const res = await EquipmentService.searchByName(name);
      setEquipments(res);
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra khi tìm kiếm");
    } finally {
      setIsLoading(false);
    }
  };

  const refresh = async () => {
    if (searchTerm.trim()) await fetchByName(searchTerm.trim());
    else await fetchAll();
  };

  const handleCreate = async (data: CreateEquipmentReq): Promise<void> => {
    try {
      await EquipmentService.createEquipment(data);
      showSuccess("Tạo thiết bị thành công");
      await refresh();
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
      await refresh();
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
          await refresh();
          setCurrentPage(1);
        } catch (err: any) {
          showError(err?.message ?? "Xoá thiết bị thất bại");
        }
      },
    });
  };

  // HANDLERS
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (value.trim() === "") fetchAll();
      else fetchByName(value.trim());
    }, DEBOUNCE_MS);
  };

  // ── PAGINATION / FILTER ───────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(equipments.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = equipments.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );
  const startIndex = (currentPage - 1) * PAGE_SIZE;

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
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return {
    // data
    equipments,
    paginated,
    isLoading,
    // search & pagination
    searchTerm,
    setSearchTerm: handleSearchChange,
    currentPage: safePage,
    totalPages,
    handlePageChange,
    startIndex,
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
