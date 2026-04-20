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
import { CategoryService } from "@/hooks/category.service";
import { CategoryType } from "@/utils/ProductType";
import CategoryFormFields from "./CategoryFormFields";
import SubcategoryList from "./SubcategoryList";

export type CategoryForm = {
  name: string;
  description: string;
  imageUrl: string;
  categoryType: CategoryType | null;
  parentCategoryId: string | null;
  active: boolean;
};

export type CategoryFormError = Partial<Record<keyof CategoryForm, string>>;

export const EMPTY_CATEGORY_FORM: CategoryForm = {
  name: "",
  description: "",
  imageUrl: "",
  categoryType: null,
  parentCategoryId: null,
  active: true,
};

export const validateCategoryForm = (form: CategoryForm): CategoryFormError => {
  const errors: CategoryFormError = {};
  if (!form.name.trim()) errors.name = "Tên danh mục không được để trống";
  return errors;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: CategoryEntity | null;
  allCategories: CategoryEntity[];
  onCreate: (payload: CreateCategoryReq) => void;
  onUpdate: (categoryId: string, payload: UpdateCategoryReq) => void;
};

const DetailModal = ({
  open,
  onOpenChange,
  category,
  allCategories,
  onCreate,
  onUpdate,
}: Props) => {
  const isEditMode = !!category;

  const [initialForm, setInitialForm] = useState<CategoryForm | null>(null);
  const [form, setForm] = useState<CategoryForm>(EMPTY_CATEGORY_FORM);
  const [touched, setTouched] = useState<
    Partial<Record<keyof CategoryForm, boolean>>
  >({});
  const [errors, setErrors] = useState<CategoryFormError>({});

  const [subcategories, setSubcategories] = useState<CategoryEntity[]>([]);
  const [loadingSub, setLoadingSub] = useState(false);

  const isValid = Object.keys(errors).length === 0;

  const isDirty =
    !isEditMode ||
    (!!initialForm &&
      (form.name !== initialForm.name ||
        form.description !== initialForm.description ||
        form.imageUrl !== initialForm.imageUrl ||
        form.categoryType !== initialForm.categoryType ||
        form.parentCategoryId !== initialForm.parentCategoryId ||
        form.active !== initialForm.active));

  const parentOptions = allCategories.filter(
    (c) => !category || c.categoryId !== category.categoryId,
  );

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
      parentCategoryId: form.parentCategoryId,
    };

    if (isEditMode && category) {
      onUpdate(category.categoryId, {
        ...payload,
        active: form.active,
      } as UpdateCategoryReq);
    } else {
      onCreate(payload as CreateCategoryReq);
    }
  };

  const refreshSubcategories = async () => {
    if (!category) return;
    const subs = await CategoryService.getSubcategory(category.categoryId);
    setSubcategories(subs);
  };

  const handleSubCreate = async (payload: CreateCategoryReq): Promise<void> => {
    onCreate(payload);
    await refreshSubcategories();
  };

  const handleSubUpdate = async (
    id: string,
    payload: UpdateCategoryReq,
  ): Promise<void> => {
    onUpdate(id, payload);
    await refreshSubcategories();
  };

  useEffect(() => {
    if (open) {
      if (category) {
        const init: CategoryForm = {
          name: category.name,
          description: category.description ?? "",
          imageUrl: category.imageUrl ?? "",
          categoryType: category.categoryType,
          parentCategoryId: category.parentCategoryId,
          active: category.active,
        };
        setForm(init);
        setInitialForm(init);

        setLoadingSub(true);
        CategoryService.getSubcategory(category.categoryId)
          .then(setSubcategories)
          .catch(() => setSubcategories([]))
          .finally(() => setLoadingSub(false));
      } else {
        setForm(EMPTY_CATEGORY_FORM);
        setInitialForm(null);
        setSubcategories([]);
      }
      setTouched({});
      setErrors({});
    }
  }, [open, category]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`rounded-2xl ${isEditMode ? "!max-w-4xl" : "!max-w-lg"}`}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-orange-700">
            {isEditMode ? "Chi tiết danh mục" : "Tạo danh mục mới"}
          </DialogTitle>
        </DialogHeader>

        {/* Body: 2-col in edit, 1-col in create */}
        <div
          className={`${isEditMode ? "grid grid-cols-2 gap-6 items-start" : "space-y-4"}`}
        >
          {/* LEFT — form */}
          <div className="space-y-4">
            <CategoryFormFields
              form={form}
              errors={errors}
              touched={touched}
              isEditMode={isEditMode}
              parentCategories={parentOptions}
              handleChange={handleChange}
              handleBlur={handleBlur}
            />

            {isEditMode && category && (
              <div className="border-t pt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Ngày tạo</span>
                  <span>
                    {new Date(category.createdAt).toLocaleString("vi-VN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Cập nhật lần cuối</span>
                  <span>
                    {new Date(category.updatedAt).toLocaleString("vi-VN")}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — subcategories (edit only) */}
          {isEditMode && category && (
            <div className="border-l pl-6">
              <SubcategoryList
                parentCategoryId={category.categoryId}
                subcategories={subcategories}
                allCategories={allCategories}
                isLoading={loadingSub}
                onCreate={handleSubCreate}
                onUpdate={handleSubUpdate}
              />
            </div>
          )}
        </div>

        <DialogFooter className="pt-3 border-t mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Huỷ
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isEditMode ? !isDirty || !isValid : !isValid}
            variant="outline"
            className="bg-orange-50 text-orange-700 hover:bg-orange-200 hover:text-orange-700 disabled:opacity-50"
          >
            {isEditMode ? "Lưu thay đổi" : "Tạo danh mục"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetailModal;
