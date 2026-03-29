"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useFirebaseUpload } from "@/hooks/useFirebaseUpload";
import { DIFFICULTY_LEVELS, getLevelLabel } from "@/utils/uiMapper";
import { CourseType, CreateCourseReq, LevelType } from "@/utils/CourseType";

export type CourseInfoRef = {
  getData: () => CreateCourseReq;
};

type Props = {
  initialData?: CourseType; // có = edit, không có = create
};

const EMPTY_FORM: CreateCourseReq = {
  name: "",
  description: "",
  imageUrl: "",
  level: "BEGINNER",
  price: 0,
};

const CourseInfo = forwardRef<CourseInfoRef, Props>(({ initialData }, ref) => {
  const [form, setForm] = useState<CreateCourseReq>(
    initialData
      ? {
          name: initialData.name,
          description: initialData.description,
          imageUrl: initialData.imageUrl,
          level: initialData.level,
          price: initialData.price,
        }
      : EMPTY_FORM,
  );
  const [preview, setPreview] = useState(initialData?.imageUrl ?? "");
  const { uploadImage, loading } = useFirebaseUpload();

  useImperativeHandle(ref, () => ({ getData: () => form }));

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    try {
      const downloadUrl = await uploadImage(file);
      setForm((prev) => ({ ...prev, imageUrl: downloadUrl }));
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <div>
            <Label htmlFor="course-name" className="text-sm font-semibold">
              Tên khóa học <span className="text-red-500">*</span>
            </Label>
            <Input
              id="course-name"
              placeholder="Vd: Khóa Pilates cho người mới bắt đầu"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              className="mt-1.5"
            />
          </div>

          <div>
            <Label
              htmlFor="course-description"
              className="text-sm font-semibold"
            >
              Mô tả <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="course-description"
              placeholder="Hãy mô tả chi tiết khóa học..."
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={4}
              className="mt-1.5 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="difficulty" className="text-sm font-semibold">
                Độ khó <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.level}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, level: value as LevelType }))
                }
              >
                <SelectTrigger id="difficulty" className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {getLevelLabel(level)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="price" className="text-sm font-semibold">
                Giá (VND) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                placeholder="100.000"
                value={form.price || ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    price: parseFloat(e.target.value) || 0,
                  }))
                }
                step="0.01"
                min="0"
                className="mt-1.5"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="image-upload" className="text-sm font-semibold">
              Hình ảnh <span className="text-red-500">*</span>
            </Label>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={loading}
              className="mt-1.5"
            />
          </div>

          <div className="mt-4">
            <Label className="text-xs mb-2 block">Xem trước</Label>
            {preview ? (
              <Card className="overflow-hidden border-2 border-dashed">
                <img
                  src={preview}
                  alt="Course preview"
                  className="w-full h-48 object-cover"
                  onError={() => setPreview("")}
                />
              </Card>
            ) : (
              <Card className="w-full h-48 flex items-center justify-center border-2 border-dashed bg-slate-50">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Không có hình ảnh</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Hãy chọn hình ảnh hợp lệ
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

CourseInfo.displayName = "CourseInfo";
export default CourseInfo;
