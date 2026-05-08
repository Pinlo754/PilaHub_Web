import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { SupplementType, CreateSupplementReq } from "@/utils/SupplementType";
import { IngredientType, IngredientRuleType } from "@/utils/IngredientType";
import { PurposeType } from "@/utils/PurposeType";
import { useToast } from "@/hooks/useToast";
import { useConfirm } from "@/hooks/useConfirm";
import { SupplementService } from "@/hooks/supplement.service";
import { SupplementIngredientService } from "@/hooks/supplementIngredient.service";
import { SupplementPurposeService } from "@/hooks/supplementPurpose.service";
import { IngredientService } from "@/hooks/ingredient.service";
import { PurposeService } from "@/hooks/purpose.service";

// Re-export types để dùng trong modal
export type IngredientEntry = {
  ingredientId: string;
  amount: string;
  unit: string;
  notes: string;
};

export type PurposeEntry = {
  purposeId: string;
  primary: boolean;
  effectivenessNotes: string;
};

export type CreateSupplementPayload = {
  form: {
    name: string;
    description: string;
    brand: string;
    form: string;
    usageInstructions: string;
    benefits: string;
    sideEffects: string;
    contraindications: string;
    warnings: string;
    imageUrl: string;
  };
  imageFile: File | null;
  ingredientEntries: IngredientEntry[];
  purposeEntries: PurposeEntry[];
};

export const useSupplements = () => {
  const PAGE_SIZE = 10;
  const DEBOUNCE_MS = 500;
  const router = useRouter();

  const [supplements, setSupplements] = useState<SupplementType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Data cho modal
  const [allIngredients, setAllIngredients] = useState<IngredientType[]>([]);
  const [allPurposes, setAllPurposes] = useState<PurposeType[]>([]);
  const [rulesMap, setRulesMap] = useState<
    Record<string, IngredientRuleType[]>
  >({});
  const [isModalDataLoading, setIsModalDataLoading] = useState(false);

  const { toasts, removeToast, showSuccess, showError } = useToast();
  const { confirmState, isConfirmOpen, confirm, closeConfirm } = useConfirm();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const res = await SupplementService.getAll();
      setSupplements(res);
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchByName = async (name: string) => {
    setIsLoading(true);
    try {
      const res = await SupplementService.searchByName(name);
      setSupplements(res);
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra khi tìm kiếm");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (value.trim() === "") fetchAll();
      else fetchByName(value.trim());
    }, DEBOUNCE_MS);
  };

  const refresh = async () => {
    if (searchTerm.trim()) await fetchByName(searchTerm.trim());
    else await fetchAll();
  };

  const handlePress = (item: SupplementType) => {
    router.push(`/supplements/${item.supplementId}`);
  };

  const toggleActive = (item: SupplementType) => {
    const isActive = item.active;
    confirm({
      title: isActive ? "Tắt hoạt động?" : "Kích hoạt?",
      description: isActive
        ? `Bạn có chắc muốn tắt hoạt động "${item.name}"?`
        : `Bạn có chắc muốn kích hoạt "${item.name}"?`,
      confirmLabel: isActive ? "Tắt" : "Kích hoạt",
      variant: isActive ? "danger" : "info",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          if (isActive) {
            await SupplementService.deactiveSupplement(item.supplementId);
            showSuccess("Đã tắt hoạt động");
          } else {
            await SupplementService.activeSupplement(item.supplementId);
            showSuccess("Đã kích hoạt");
          }
          await refresh();
        } catch (err: any) {
          showError(err?.message ?? "Có lỗi xảy ra");
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const deleteSupplement = (supplementId: string, name: string) => {
    confirm({
      title: "Xoá thực phẩm chức năng?",
      description: `Hành động này sẽ xoá vĩnh viễn "${name}" và không thể hoàn tác.`,
      confirmLabel: "Xoá",
      variant: "danger",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          await SupplementService.deleteSupplement(supplementId);
          showSuccess("Đã xoá thành công");
          await refresh();
        } catch (err: any) {
          showError(err?.message ?? "Có lỗi xảy ra khi xoá");
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  // ── Modal data fetching ──────────────────────────────────────────────────

  const openCreateModal = async () => {
    setShowCreateModal(true);
    setIsModalDataLoading(true);
    try {
      const [ingredients, purposes] = await Promise.all([
        IngredientService.getAll(),
        PurposeService.getAll(),
      ]);
      setAllIngredients(ingredients);
      setAllPurposes(purposes);
    } catch {
      showError("Có lỗi khi tải dữ liệu modal");
    } finally {
      setIsModalDataLoading(false);
    }
  };

  const loadIngredientRules = async (ingredientId: string) => {
    if (rulesMap[ingredientId]) return;
    try {
      const rules = await IngredientService.getRuleById(ingredientId);
      setRulesMap((prev) => ({ ...prev, [ingredientId]: rules }));
    } catch {}
  };

  // ── Submit ───────────────────────────────────────────────────────────────

  const submitCreateSupplement = async (
    payload: CreateSupplementPayload,
    uploadImage: (file: File) => Promise<string>,
  ): Promise<boolean> => {
    try {
      let imageUrl = payload.form.imageUrl;
      if (payload.imageFile) {
        imageUrl = await uploadImage(payload.imageFile);
      }

      const req: CreateSupplementReq = {
        name: payload.form.name.trim(),
        description: payload.form.description.trim(),
        brand: payload.form.brand.trim(),
        form: payload.form.form.trim(),
        usageInstructions: payload.form.usageInstructions.trim(),
        benefits: payload.form.benefits.trim(),
        sideEffects: payload.form.sideEffects.trim(),
        contraindications: payload.form.contraindications.trim(),
        warnings: payload.form.warnings.trim(),
        imageUrl,
      };

      const created = await SupplementService.createSupplement(req);
      const supplementId = created.supplementId;

      for (const entry of payload.ingredientEntries) {
        if (!entry.ingredientId) continue;
        await SupplementIngredientService.createSupplementIngredient({
          supplementId,
          ingredientId: entry.ingredientId,
          amount: Number(entry.amount),
          unit: entry.unit.trim(),
          notes: entry.notes.trim(),
        });
      }

      for (const entry of payload.purposeEntries) {
        if (!entry.purposeId) continue;
        await SupplementPurposeService.createSupplementPurpose({
          supplementId,
          purposeId: entry.purposeId,
          primary: entry.primary,
          effectivenessNotes: entry.effectivenessNotes.trim(),
        });
      }

      showSuccess("Thêm thực phẩm chức năng thành công");
      await refresh();
      return true;
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra khi thêm");
      return false;
    }
  };

  // ── Pagination ───────────────────────────────────────────────────────────

  const totalPages = Math.max(1, Math.ceil(supplements.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const paginated = supplements.slice(startIndex, startIndex + PAGE_SIZE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

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
    showCreateModal,
    setShowCreateModal,
    openCreateModal,
    handlePress,
    toggleActive,
    deleteSupplement,
    refresh,
    toasts,
    removeToast,
    showSuccess,
    showError,
    confirmState,
    isConfirmOpen,
    closeConfirm,
    // Modal data
    allIngredients,
    allPurposes,
    rulesMap,
    isModalDataLoading,
    loadIngredientRules,
    submitCreateSupplement,
  };
};
