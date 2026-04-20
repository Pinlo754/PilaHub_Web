"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  CategoryType as CategoryEntity,
  CreateCategoryReq,
  UpdateCategoryReq,
} from "@/utils/CategoryType";
import CategoryFormFields from "./CategoryFormFields";
import {
  CategoryForm,
  EMPTY_CATEGORY_FORM,
  validateCategoryForm,
  CategoryFormError,
} from "./DetailModal";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subcategory: CategoryEntity | null; // null = create
  parentCategoryId: string;
  allCategories: CategoryEntity[];
  onCreate: (payload: CreateCategoryReq) => Promise<void>;
  onUpdate: (categoryId: string, payload: UpdateCategoryReq) => Promise<void>;
  onClose: () => void;
};

const SubcategoryModal = ({
  open,
  onOpenChange,
  subcategory,
  parentCategoryId,
  allCategories,
  onCreate,
  onUpdate,
  onClose,
}: Props) => {
  const isEditMode = !!subcategory;

  const [initialForm, setInitialForm] = useState<CategoryForm | null>(null);
  const [form, setForm] = useState<CategoryForm>(EMPTY_CATEGORY_FORM);
  const [touched, setTouched] = useState<
    Partial<Record<keyof CategoryForm, boolean>>
  >({});
  const [errors, setErrors] = useState<CategoryFormError>({});

  const isValid = Object.keys(errors).length === 0;
  const isDirty =
    !isEditMode ||
    (!!initialForm &&
      (form.name !== initialForm.name ||
        form.description !== initialForm.description ||
        form.imageUrl !== initialForm.imageUrl ||
        form.categoryType !== initialForm.categoryType ||
        form.active !== initialForm.active));

  const handleChange = <K extends keyof CategoryForm>(
    key: K,
    value: CategoryForm[K],
  ) => {
    setForm((prev) => {
      const updated = { ...prev, [key]: value };
      if (touched[key]) {
        const errs = validateCategoryForm(updated);
        setErrors((prev) => {
          const next = { ...prev };
          if (errs[key]) next[key] = errs[key];
          else delete next[key];
          return next;
        });
      }
      return updated;
    });
  };

  const handleBlur = (key: keyof CategoryForm) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    const errs = validateCategoryForm(form);
    setErrors((prev) => {
      const next = { ...prev };
      if (errs[key]) next[key] = errs[key];
      else delete next[key];
      return next;
    });
  };

  const handleSubmit = () => {
    const allTouched = Object.keys(form).reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {} as Record<keyof CategoryForm, boolean>,
    );
    setTouched(allTouched);
    const errs = validateCategoryForm(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0 || !isDirty) return;

    const payload = {
      name: form.name,
      description: form.description,
      imageUrl: form.imageUrl,
      categoryType: form.categoryType,
      parentCategoryId: parentCategoryId,
    };

    if (isEditMode && subcategory) {
      onUpdate(subcategory.categoryId, { ...payload });
    } else {
      onCreate(payload as CreateCategoryReq);
    }
    onClose();
  };

  useEffect(() => {
    if (open) {
      if (subcategory) {
        const init: CategoryForm = {
          name: subcategory.name,
          description: subcategory.description ?? "",
          imageUrl: subcategory.imageUrl ?? "",
          categoryType: subcategory.categoryType,
          parentCategoryId: subcategory.parentCategoryId,
          active: subcategory.active,
        };
        setForm(init);
        setInitialForm(init);
      } else {
        const init: CategoryForm = {
          ...EMPTY_CATEGORY_FORM,
          parentCategoryId: parentCategoryId,
        };
        setForm(init);
        setInitialForm(null);
      }
      setTouched({});
      setErrors({});
    }
  }, [open, subcategory, parentCategoryId]);

  // Parent options: all categories except self
  const parentOptions = allCategories.filter(
    (c) => !subcategory || c.categoryId !== subcategory.categoryId,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-orange-700">
            {isEditMode ? "Chi tiết danh mục con" : "Thêm danh mục con mới"}
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[65vh] pr-1">
          <CategoryFormFields
            form={form}
            errors={errors}
            touched={touched}
            isEditMode={isEditMode}
            parentCategories={parentOptions}
            handleChange={handleChange}
            handleBlur={handleBlur}
          />

          {isEditMode && subcategory && (
            <div className="border-t mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Ngày tạo</span>
                <span>
                  {new Date(subcategory.createdAt).toLocaleString("vi-VN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Cập nhật lần cuối</span>
                <span>
                  {new Date(subcategory.updatedAt).toLocaleString("vi-VN")}
                </span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="pt-2 border-t mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Huỷ
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isEditMode ? !isDirty || !isValid : !isValid}
            variant="outline"
            className="bg-orange-50 text-orange-700 hover:bg-orange-200 hover:text-orange-700 disabled:opacity-50"
          >
            {isEditMode ? "Lưu thay đổi" : "Tạo danh mục con"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubcategoryModal;
