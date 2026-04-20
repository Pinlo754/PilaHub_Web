"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { ExerciseService } from "@/hooks/exercise.service";
import { useFirebaseUpload } from "@/hooks/useFirebaseUpload";
import { BodyPartType, CreateExerciseReq } from "@/utils/ExerciseType";
import {
  DIFFICULTY_LEVELS,
  getLevelLabel,
  EXERCISE_TYPE_SELECT_OPTIONS,
  BREATHING_RULE_SELECT_OPTIONS,
} from "@/utils/uiMapper";

type Props = {
  form: Partial<CreateExerciseReq>;
  onChange: (form: Partial<CreateExerciseReq>) => void;
};

const ExerciseForm = ({ form, onChange }: Props) => {
  const [bodyParts, setBodyParts] = useState<BodyPartType[]>([]);
  const [preview, setPreview] = useState("");
  const { uploadImage, loading: uploading } = useFirebaseUpload();

  useEffect(() => {
    ExerciseService.getAllBodyPart()
      .then(setBodyParts)
      .catch(() => {});
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    try {
      const url = await uploadImage(file);
      onChange({ ...form, imageUrl: url });
    } catch {
      // ignore
    }
  };

  const toggleBodyPart = (name: string) => {
    const current = form.bodyParts ?? [];
    const next = current.includes(name)
      ? current.filter((b) => b !== name)
      : [...current, name];
    onChange({ ...form, bodyParts: next });
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left */}
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-semibold">
              Tên bài tập <span className="text-red-500">*</span>
            </Label>
            <Input
              className="mt-1.5"
              placeholder="Vd: Push-ups"
              value={form.name ?? ""}
              onChange={(e) => onChange({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <Label className="text-sm font-semibold">
              Mô tả <span className="text-red-500">*</span>
            </Label>
            <Textarea
              className="mt-1.5 resize-none"
              rows={3}
              placeholder="Mô tả chi tiết bài tập..."
              value={form.description ?? ""}
              onChange={(e) =>
                onChange({ ...form, description: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-semibold">
                Loại bài tập <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.exerciseType ?? ""}
                onValueChange={(v) =>
                  onChange({ ...form, exerciseType: v as any })
                }
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent>
                  {EXERCISE_TYPE_SELECT_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-semibold">
                Độ khó <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.difficultyLevel ?? ""}
                onValueChange={(v) =>
                  onChange({ ...form, difficultyLevel: v as any })
                }
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Chọn độ khó" />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_LEVELS.map((l) => (
                    <SelectItem key={l} value={l}>
                      {getLevelLabel(l)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-semibold">Thời lượng (giây)</Label>
              <Input
                className="mt-1.5"
                type="number"
                min="0"
                placeholder="300"
                value={form.duration ?? ""}
                onChange={(e) =>
                  onChange({ ...form, duration: parseInt(e.target.value) || 0 })
                }
              />
            </div>

            <div>
              <Label className="text-sm font-semibold">Quy tắc thở</Label>
              <Select
                value={form.breathingRule ?? ""}
                onValueChange={(v) =>
                  onChange({ ...form, breathingRule: v as any })
                }
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Chọn quy tắc" />
                </SelectTrigger>
                <SelectContent>
                  {BREATHING_RULE_SELECT_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border hover:bg-orange-50 transition-colors">
              <input
                type="checkbox"
                checked={form.equipmentRequired ?? false}
                onChange={(e) =>
                  onChange({ ...form, equipmentRequired: e.target.checked })
                }
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">Cần thiết bị</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border hover:bg-orange-50 transition-colors">
              <input
                type="checkbox"
                checked={form.haveAIsupported ?? false}
                onChange={(e) =>
                  onChange({ ...form, haveAIsupported: e.target.checked })
                }
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">AI hỗ trợ</span>
            </label>
          </div>

          {form.haveAIsupported && (
            <div>
              <Label className="text-sm font-semibold">
                Tên trong mô hình AI
              </Label>
              <Input
                className="mt-1.5"
                placeholder="Vd: push_up"
                value={form.nameInModelAI ?? ""}
                onChange={(e) =>
                  onChange({ ...form, nameInModelAI: e.target.value })
                }
              />
            </div>
          )}
        </div>

        {/* Right */}
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-semibold">
              Hình ảnh <span className="text-red-500">*</span>
            </Label>
            <Input
              className="mt-1.5"
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={handleFileChange}
            />
            <div className="mt-3">
              {preview ? (
                <Card className="overflow-hidden h-36 border-2 border-dashed">
                  <img src={preview} className="w-full h-36 object-cover" />
                </Card>
              ) : (
                <Card className="h-36 flex items-center justify-center border-2 border-dashed bg-slate-50">
                  <p className="text-sm text-gray-400">Xem trước ảnh</p>
                </Card>
              )}
            </div>
          </div>

          <div>
            <Label className="text-sm font-semibold">Lợi ích</Label>
            <Textarea
              className="mt-1.5 resize-none"
              rows={2}
              placeholder="Lợi ích của bài tập..."
              value={form.benefits ?? ""}
              onChange={(e) => onChange({ ...form, benefits: e.target.value })}
            />
          </div>

          <div>
            <Label className="text-sm font-semibold">
              Điều kiện tiên quyết
            </Label>
            <Textarea
              className="mt-1.5 resize-none"
              rows={2}
              placeholder="Điều kiện cần có trước khi tập..."
              value={form.prerequisites ?? ""}
              onChange={(e) =>
                onChange({ ...form, prerequisites: e.target.value || null })
              }
            />
          </div>

          <div>
            <Label className="text-sm font-semibold">Chống chỉ định</Label>
            <Textarea
              className="mt-1.5 resize-none"
              rows={2}
              placeholder="Trường hợp không nên tập..."
              value={form.contraindications ?? ""}
              onChange={(e) =>
                onChange({ ...form, contraindications: e.target.value || null })
              }
            />
          </div>

          {/* Body parts */}
          <div>
            <Label className="text-sm font-semibold block mb-2">Nhóm cơ</Label>
            <div className="flex flex-wrap gap-2">
              {bodyParts.map((bp) => {
                const selected = (form.bodyParts ?? []).includes(bp.name);
                return (
                  <button
                    key={bp.bodyPartId}
                    type="button"
                    onClick={() => toggleBodyPart(bp.name)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      selected
                        ? "bg-orange-500 text-white border-orange-500"
                        : "bg-white text-gray-600 border-gray-300 hover:border-orange-300"
                    }`}
                  >
                    {bp.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseForm;
