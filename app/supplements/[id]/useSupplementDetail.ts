import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SupplementType, UpdateSupplementReq } from "@/utils/SupplementType";
import {
  SupplementIngredientType,
  UpdateSupplementIngredientReq,
} from "@/utils/SupplementIngredientType";
import {
  SupplementPurposeType,
  UpdateSupplementPurposeReq,
} from "@/utils/SupplementPurposeType";
import { IngredientType, IngredientRuleType } from "@/utils/IngredientType";
import { PurposeType } from "@/utils/PurposeType";
import { useToast } from "@/hooks/useToast";
import { useConfirm } from "@/hooks/useConfirm";
import { useFirebaseUpload } from "@/hooks/useFirebaseUpload";
import { SupplementService } from "@/hooks/supplement.service";
import { SupplementIngredientService } from "@/hooks/supplementIngredient.service";
import { SupplementPurposeService } from "@/hooks/supplementPurpose.service";
import { IngredientService } from "@/hooks/ingredient.service";
import { PurposeService } from "@/hooks/purpose.service";

export const useSupplementDetail = (supplementId: string) => {
  const router = useRouter();

  const [supplement, setSupplement] = useState<SupplementType | null>(null);
  const [suppIngredients, setSuppIngredients] = useState<
    SupplementIngredientType[]
  >([]);
  const [suppPurposes, setSuppPurposes] = useState<SupplementPurposeType[]>([]);
  const [allIngredients, setAllIngredients] = useState<IngredientType[]>([]);
  const [allPurposes, setAllPurposes] = useState<PurposeType[]>([]);
  const [rulesMap, setRulesMap] = useState<
    Record<string, IngredientRuleType[]>
  >({});
  const [isLoading, setIsLoading] = useState(false);

  const { toasts, removeToast, showSuccess, showError } = useToast();
  const { confirmState, isConfirmOpen, confirm, closeConfirm } = useConfirm();
  const { uploadImage, loading: uploading, progress } = useFirebaseUpload();

  const fetchSupplement = async () => {
    setIsLoading(true);
    try {
      const res = await SupplementService.getSupplementById(supplementId);
      if (res.success) setSupplement(res.data as any);
    } catch (err: any) {
      showError(err?.message ?? "Không thể tải sản phẩm");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchIngredients = async () => {
    try {
      const res =
        await SupplementIngredientService.getBySupplementId(supplementId);
      setSuppIngredients(res);
    } catch {}
  };

  const fetchPurposes = async () => {
    try {
      const res =
        await SupplementPurposeService.getBySupplementId(supplementId);
      setSuppPurposes(res);
    } catch {}
  };

  const fetchAll = async () => {
    await Promise.all([fetchSupplement(), fetchIngredients(), fetchPurposes()]);
  };

  const fetchCatalogues = async () => {
    try {
      const [ings, purps] = await Promise.all([
        IngredientService.getAll(),
        PurposeService.getAll(),
      ]);
      setAllIngredients(ings);
      setAllPurposes(purps);
    } catch {}
  };

  const loadRules = async (ingredientId: string) => {
    if (rulesMap[ingredientId]) return;
    try {
      const rules = await IngredientService.getRuleById(ingredientId);
      setRulesMap((prev) => ({ ...prev, [ingredientId]: rules }));
    } catch {}
  };

  // ── Supplement info update ──────────────────────────────────────────────────

  const updateSupplement = async (
    payload: UpdateSupplementReq,
    imageFile?: File | null,
  ) => {
    setIsLoading(true);
    try {
      let finalPayload = { ...payload };
      if (imageFile) {
        const url = await uploadImage(imageFile);
        finalPayload = { ...finalPayload, imageUrl: url };
      }
      await SupplementService.updateSupplement(supplementId, finalPayload);
      showSuccess("Cập nhật thông tin thành công");
      await fetchSupplement();
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra khi cập nhật");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleActive = () => {
    if (!supplement) return;
    const isActive = supplement.active;
    confirm({
      title: isActive ? "Tắt hoạt động?" : "Kích hoạt?",
      description: isActive
        ? `Bạn có chắc muốn tắt hoạt động "${supplement.name}"?`
        : `Bạn có chắc muốn kích hoạt "${supplement.name}"?`,
      confirmLabel: isActive ? "Tắt" : "Kích hoạt",
      variant: isActive ? "danger" : "info",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          if (isActive)
            await SupplementService.deactiveSupplement(supplementId);
          else await SupplementService.activeSupplement(supplementId);
          showSuccess(isActive ? "Đã tắt hoạt động" : "Đã kích hoạt");
          await fetchSupplement();
        } catch (err: any) {
          showError(err?.message ?? "Có lỗi xảy ra");
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const deleteSupplement = () => {
    if (!supplement) return;
    confirm({
      title: "Xoá thực phẩm chức năng?",
      description: `Hành động này sẽ xoá vĩnh viễn "${supplement.name}" và không thể hoàn tác.`,
      confirmLabel: "Xoá",
      variant: "danger",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          await SupplementService.deleteSupplement(supplementId);
          showSuccess("Đã xoá thành công");
          router.push("/supplements");
        } catch (err: any) {
          showError(err?.message ?? "Có lỗi xảy ra khi xoá");
          setIsLoading(false);
        }
      },
    });
  };

  // ── Supplement Ingredient ───────────────────────────────────────────────────

  const createIngredient = async (payload: {
    ingredientId: string;
    amount: number;
    unit: string;
    notes: string;
  }) => {
    setIsLoading(true);
    try {
      await SupplementIngredientService.createSupplementIngredient({
        supplementId,
        ...payload,
      });
      showSuccess("Đã thêm nguyên liệu");
      await fetchIngredients();
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  const updateIngredient = async (
    supplementIngredientId: string,
    payload: UpdateSupplementIngredientReq,
  ) => {
    setIsLoading(true);
    try {
      await SupplementIngredientService.updateSupplementIngredient(
        supplementIngredientId,
        payload,
      );
      showSuccess("Đã cập nhật nguyên liệu");
      await fetchIngredients();
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteIngredient = (supplementIngredientId: string, name: string) => {
    confirm({
      title: "Xoá nguyên liệu?",
      description: `Xoá nguyên liệu "${name}" khỏi sản phẩm này?`,
      confirmLabel: "Xoá",
      variant: "danger",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          await SupplementIngredientService.deleteSupplementIngredient(
            supplementIngredientId,
          );
          showSuccess("Đã xoá nguyên liệu");
          await fetchIngredients();
        } catch (err: any) {
          showError(err?.message ?? "Có lỗi xảy ra");
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  // ── Supplement Purpose ──────────────────────────────────────────────────────

  const createPurpose = async (payload: {
    purposeId: string;
    primary: boolean;
    effectivenessNotes: string;
  }) => {
    setIsLoading(true);
    try {
      await SupplementPurposeService.createSupplementPurpose({
        supplementId,
        ...payload,
      });
      showSuccess("Đã thêm mục đích");
      await fetchPurposes();
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  const updatePurpose = async (
    supplementPurposeId: string,
    payload: UpdateSupplementPurposeReq,
  ) => {
    setIsLoading(true);
    try {
      await SupplementPurposeService.updateSupplementPurpose(
        supplementPurposeId,
        payload,
      );
      showSuccess("Đã cập nhật mục đích");
      await fetchPurposes();
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  const deletePurpose = (supplementPurposeId: string, name: string) => {
    confirm({
      title: "Xoá mục đích?",
      description: `Xoá mục đích "${name}" khỏi sản phẩm này?`,
      confirmLabel: "Xoá",
      variant: "danger",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          await SupplementPurposeService.deleteSupplementPurpose(
            supplementPurposeId,
          );
          showSuccess("Đã xoá mục đích");
          await fetchPurposes();
        } catch (err: any) {
          showError(err?.message ?? "Có lỗi xảy ra");
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  useEffect(() => {
    fetchAll();
    fetchCatalogues();
  }, [supplementId]);

  // IDs already used (for filtering dropdowns)
  const usedIngredientIds = suppIngredients.map(
    (si) => si.ingredient.ingredientId,
  );
  const usedPurposeIds = suppPurposes.map((sp) => sp.purpose.purposeId);

  return {
    supplement,
    suppIngredients,
    suppPurposes,
    allIngredients,
    allPurposes,
    rulesMap,
    loadRules,
    usedIngredientIds,
    usedPurposeIds,
    isLoading,
    uploading,
    progress,
    updateSupplement,
    toggleActive,
    deleteSupplement,
    createIngredient,
    updateIngredient,
    deleteIngredient,
    createPurpose,
    updatePurpose,
    deletePurpose,
    toasts,
    removeToast,
    confirmState,
    isConfirmOpen,
    closeConfirm,
  };
};
