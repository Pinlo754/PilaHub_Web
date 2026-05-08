import { Plus } from "lucide-react";
import { PurposeType } from "@/utils/PurposeType";
import { PurposeRow, PurposeEntry, PurposeEntryError } from "./PurposeRow";

type Props = {
  entries: PurposeEntry[];
  errors: PurposeEntryError[];
  purposes: PurposeType[];
  onAdd: () => void;
  onRemove: (idx: number) => void;
  onChange: (idx: number, field: keyof PurposeEntry, value: any) => void;
};

export const PurposesStep = ({
  entries,
  errors,
  purposes,
  onAdd,
  onRemove,
  onChange,
}: Props) => {
  const usedIds = entries.map((e) => e.purposeId).filter(Boolean);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Thêm các mục đích sử dụng sản phẩm
        </p>
        <button
          onClick={onAdd}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          <Plus size={16} /> Thêm mục đích
        </button>
      </div>

      {entries.length === 0 && (
        <div className="text-center py-8 text-gray-400 border-2 border-dashed border-blue-100 rounded-xl">
          Chưa có mục đích nào. Nhấn &quot;Thêm mục đích&quot; để bắt đầu.
        </div>
      )}

      {entries.map((entry, idx) => (
        <PurposeRow
          key={idx}
          entry={entry}
          index={idx}
          purposes={purposes}
          usedIds={usedIds}
          errors={errors[idx] ?? {}}
          onChange={(field, value) => onChange(idx, field, value)}
          onDelete={() => onRemove(idx)}
        />
      ))}
    </div>
  );
};
