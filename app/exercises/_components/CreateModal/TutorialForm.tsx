"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useFirebaseUpload } from "@/hooks/useFirebaseUpload";
import { TutorialFormData } from "./CreateModal";
import { Upload } from "lucide-react";

type Props = {
  form: TutorialFormData;
  onChange: (form: TutorialFormData) => void;
};

const TutorialForm = ({ form, onChange }: Props) => {
  const { uploadFile, loading } = useFirebaseUpload();

  const handleVideoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "practiceVideoUrl" | "theoryVideoUrl",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadFile(file, "tutorials");
      onChange({ ...form, [field]: url });
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Theory video */}
        <div>
          <Label className="text-sm font-semibold">Video lý thuyết</Label>
          <Input
            className="mt-1.5"
            placeholder="URL YouTube / Vimeo / MP4..."
            value={form.theoryVideoUrl}
            onChange={(e) =>
              onChange({ ...form, theoryVideoUrl: e.target.value })
            }
          />
          <div className="mt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-orange-600 hover:text-orange-700">
              <Upload size={14} />
              <span>Hoặc upload file video</span>
              <input
                type="file"
                accept="video/*"
                className="hidden"
                disabled={loading}
                onChange={(e) => handleVideoUpload(e, "theoryVideoUrl")}
              />
            </label>
            {form.theoryVideoUrl && (
              <p className="text-xs text-green-600 mt-1 truncate">
                ✓ {form.theoryVideoUrl}
              </p>
            )}
          </div>
        </div>

        {/* Practice video */}
        <div>
          <Label className="text-sm font-semibold">Video thực hành</Label>
          <Input
            className="mt-1.5"
            placeholder="URL YouTube / Vimeo / MP4..."
            value={form.practiceVideoUrl}
            onChange={(e) =>
              onChange({ ...form, practiceVideoUrl: e.target.value })
            }
          />
          <div className="mt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-orange-600 hover:text-orange-700">
              <Upload size={14} />
              <span>Hoặc upload file video</span>
              <input
                type="file"
                accept="video/*"
                className="hidden"
                disabled={loading}
                onChange={(e) => handleVideoUpload(e, "practiceVideoUrl")}
              />
            </label>
            {form.practiceVideoUrl && (
              <p className="text-xs text-green-600 mt-1 truncate">
                ✓ {form.practiceVideoUrl}
              </p>
            )}
          </div>
        </div>
      </div>

      <div>
        <Label className="text-sm font-semibold">Hướng dẫn thực hiện</Label>
        <Textarea
          className="mt-1.5 resize-none"
          rows={3}
          placeholder="Mô tả từng bước thực hiện bài tập..."
          value={form.guidelines}
          onChange={(e) => onChange({ ...form, guidelines: e.target.value })}
        />
      </div>

      <div>
        <Label className="text-sm font-semibold">Lỗi thường gặp</Label>
        <Textarea
          className="mt-1.5 resize-none"
          rows={3}
          placeholder="Các lỗi phổ biến cần tránh..."
          value={form.commonMistakes}
          onChange={(e) =>
            onChange({ ...form, commonMistakes: e.target.value })
          }
        />
      </div>

      <div>
        <Label className="text-sm font-semibold">Kỹ thuật thở</Label>
        <Textarea
          className="mt-1.5 resize-none"
          rows={3}
          placeholder="Hướng dẫn thở trong khi tập..."
          value={form.breathingTechnique}
          onChange={(e) =>
            onChange({ ...form, breathingTechnique: e.target.value })
          }
        />
      </div>

      <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border hover:bg-orange-50 transition-colors w-fit">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(e) => onChange({ ...form, published: e.target.checked })}
          className="w-4 h-4"
        />
        <span className="text-sm font-medium">Xuất bản ngay</span>
      </label>
    </div>
  );
};

export default TutorialForm;
