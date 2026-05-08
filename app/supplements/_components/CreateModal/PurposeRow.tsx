import { Trash2 } from "lucide-react";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PurposeType } from "@/utils/PurposeType";

export type PurposeEntry = {
  purposeId: string;
  primary: boolean;
  effectivenessNotes: string;
};
export type PurposeEntryError = Partial<Record<keyof PurposeEntry, string>>;

type Props = {
  entry: PurposeEntry;
  index: number;
  purposes: PurposeType[];
  usedIds: string[];
  errors: PurposeEntryError;
  onChange: (field: keyof PurposeEntry, value: any) => void;
  onDelete: () => void;
};

export const PurposeRow = ({
  entry,
  index,
  purposes,
  usedIds,
  errors,
  onChange,
  onDelete,
}: Props) => {
  const available = purposes.filter(
    (p) => !usedIds.includes(p.purposeId) || p.purposeId === entry.purposeId,
  );
  return (
    <div className="border border-blue-100 rounded-xl p-4 space-y-3 bg-blue-50/30">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-blue-700">
          Mục đích #{index + 1}
        </span>
        <button
          onClick={onDelete}
          className="p-1 text-red-400 hover:text-red-600 transition"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <Field>
        <Label>Mục đích</Label>
        <select
          value={entry.purposeId}
          onChange={(e) => onChange("purposeId", e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
        >
          <option value="">— Chọn mục đích —</option>
          {available.map((p) => (
            <option key={p.purposeId} value={p.purposeId}>
              {p.name}
            </option>
          ))}
        </select>
        {errors.purposeId && (
          <p className="text-xs text-red-500">{errors.purposeId}</p>
        )}
      </Field>

      <Field>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={entry.primary}
            onChange={(e) => onChange("primary", e.target.checked)}
            className="w-4 h-4 accent-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">
            Mục đích chính
          </span>
        </label>
      </Field>

      <Field>
        <Label>Ghi chú hiệu quả</Label>
        <Textarea
          value={entry.effectivenessNotes}
          onChange={(e) => onChange("effectivenessNotes", e.target.value)}
          placeholder="Ghi chú về hiệu quả (tuỳ chọn)"
          rows={2}
        />
      </Field>
    </div>
  );
};
