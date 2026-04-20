import { useState, useEffect } from "react";
import { ExerciseType, UpdateExerciseReq, BodyPartType } from "@/utils/ExerciseType";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useFirebaseUpload } from "@/hooks/useFirebaseUpload";
import { ExerciseService } from "@/hooks/exercise.service";
import {
  getLevelConfig, getActiveConfig,
  DIFFICULTY_LEVELS, getLevelLabel,
  EXERCISE_TYPE_SELECT_OPTIONS, BREATHING_RULE_SELECT_OPTIONS,
} from "@/utils/uiMapper";
import { formatLocalDateTime } from "@/utils/day";
import Pagination from "../../_components/Pagination";

// ── Pages ──────────────────────────────────────────────────────────────────
const SECTION_PAGES = [
  { label: "Thông tin cơ bản" },
  { label: "Thông số & Phân loại" },
  { label: "Nội dung & Nhóm cơ" },
] as const;

type Props = {
  exercise: ExerciseType;
  draft: UpdateExerciseReq;
  onDraftChange: (patch: Partial<UpdateExerciseReq>) => void;
};

const ExerciseSection = ({ exercise, draft, onDraftChange }: Props) => {
  const [bodyParts, setBodyParts] = useState<BodyPartType[]>([]);
  const [preview, setPreview] = useState(exercise.imageUrl ?? "");
  const [page, setPage] = useState(1);
  const { uploadImage, loading: uploading } = useFirebaseUpload();

  useEffect(() => {
    ExerciseService.getAllBodyPart().then(setBodyParts).catch(() => {});
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    try {
      const url = await uploadImage(file);
      onDraftChange({ imageUrl: url });
    } catch {}
  };

  const toggleBodyPart = (name: string) => {
    const current = draft.bodyParts ?? [];
    onDraftChange({
      bodyParts: current.includes(name)
        ? current.filter((b) => b !== name)
        : [...current, name],
    });
  };

  const activeConfig = getActiveConfig(exercise.active);

  return (
    <div className="bg-white rounded-2xl border-2 border-orange-200 p-5 h-full flex flex-col min-h-0">
      <div className="flex items-center justify-between mb-3 shrink-0">
        <h2 className="text-sm font-bold text-orange-500">Thông tin bài tập</h2>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${activeConfig.bgColor} ${activeConfig.textColor}`}>
          {activeConfig.label}
        </span>
      </div>

      {/* Page content */}
      <div className="flex-1 min-h-0 overflow-hidden">

        {/* PAGE 1: Basic info + image */}
        {page === 1 && (
          <div className="space-y-3 h-full overflow-y-auto pr-1">
            <div>
              <Label className="text-xs font-semibold">Hình ảnh</Label>
              <Input type="file" accept="image/*" disabled={uploading} onChange={handleFileChange} className="mt-1 text-xs" />
              <Card className="mt-2 overflow-hidden h-24 border-2 border-dashed">
                <img src={preview || draft.imageUrl || "/default-logo.png"} className="w-full h-24 object-cover" />
              </Card>
            </div>
            <div>
              <Label className="text-xs font-semibold">Tên bài tập</Label>
              <Input className="mt-1" value={draft.name ?? ""} onChange={(e) => onDraftChange({ name: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs font-semibold">Mô tả</Label>
              <Textarea className="mt-1 resize-none text-xs" rows={3} value={draft.description ?? ""}
                onChange={(e) => onDraftChange({ description: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs font-semibold">Lợi ích</Label>
              <Textarea className="mt-1 resize-none text-xs" rows={2} value={draft.benefits ?? ""}
                onChange={(e) => onDraftChange({ benefits: e.target.value })} />
            </div>
            <p className="text-xs text-gray-400 text-right pt-1">
              Ngày tạo: {formatLocalDateTime(exercise.createdAt, "date")}
            </p>
          </div>
        )}

        {/* PAGE 2: Params */}
        {page === 2 && (
          <div className="space-y-3 h-full overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Loại bài tập</Label>
                <Select value={draft.exerciseType ?? ""} onValueChange={(v) => onDraftChange({ exerciseType: v as any })}>
                  <SelectTrigger className="mt-1 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {EXERCISE_TYPE_SELECT_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-semibold">Độ khó</Label>
                <Select value={draft.difficultyLevel ?? ""} onValueChange={(v) => onDraftChange({ difficultyLevel: v as any })}>
                  <SelectTrigger className="mt-1 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {DIFFICULTY_LEVELS.map((l) => (
                      <SelectItem key={l} value={l}>{getLevelLabel(l)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Thời lượng (giây)</Label>
                <Input className="mt-1" type="number" min="0" value={draft.duration ?? 0}
                  onChange={(e) => onDraftChange({ duration: parseInt(e.target.value) || 0 })} />
              </div>
              <div>
                <Label className="text-xs font-semibold">Quy tắc thở</Label>
                <Select value={draft.breathingRule ?? ""} onValueChange={(v) => onDraftChange({ breathingRule: v as any })}>
                  <SelectTrigger className="mt-1 text-xs"><SelectValue placeholder="Chọn..." /></SelectTrigger>
                  <SelectContent>
                    {BREATHING_RULE_SELECT_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-4 pt-1">
              <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                <input type="checkbox" checked={draft.equipmentRequired ?? false}
                  onChange={(e) => onDraftChange({ equipmentRequired: e.target.checked })} className="w-3.5 h-3.5" />
                Cần thiết bị
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                <input type="checkbox" checked={draft.haveAIsupported ?? false}
                  onChange={(e) => onDraftChange({ haveAIsupported: e.target.checked })} className="w-3.5 h-3.5" />
                AI hỗ trợ
              </label>
            </div>

            {draft.haveAIsupported && (
              <div>
                <Label className="text-xs font-semibold">Tên trong AI</Label>
                <Input className="mt-1 text-xs" value={draft.nameInModelAI ?? ""}
                  onChange={(e) => onDraftChange({ nameInModelAI: e.target.value })} />
              </div>
            )}
          </div>
        )}

        {/* PAGE 3: Content + body parts */}
        {page === 3 && (
          <div className="space-y-3 h-full overflow-y-auto pr-1">
            <div>
              <Label className="text-xs font-semibold">Chống chỉ định</Label>
              <Textarea className="mt-1 resize-none text-xs" rows={2} value={draft.contraindications ?? ""}
                onChange={(e) => onDraftChange({ contraindications: e.target.value || null })} />
            </div>
            <div>
              <Label className="text-xs font-semibold">Điều kiện tiên quyết</Label>
              <Textarea className="mt-1 resize-none text-xs" rows={2} value={draft.prerequisites ?? ""}
                onChange={(e) => onDraftChange({ prerequisites: e.target.value || null })} />
            </div>
            <div>
              <Label className="text-xs font-semibold block mb-1.5">Nhóm cơ</Label>
              <div className="flex flex-wrap gap-1.5">
                {bodyParts.map((bp) => {
                  const selected = (draft.bodyParts ?? []).includes(bp.name);
                  return (
                    <button key={bp.bodyPartId} type="button" onClick={() => toggleBodyPart(bp.name)}
                      className={`px-2 py-0.5 rounded-full text-xs border transition-colors ${
                        selected ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-600 border-gray-300 hover:border-orange-300"
                      }`}>
                      {bp.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pagination inside the box */}
      <div className="shrink-0 pt-3 border-t mt-3">
        <Pagination currentPage={page} totalPages={SECTION_PAGES.length} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default ExerciseSection;