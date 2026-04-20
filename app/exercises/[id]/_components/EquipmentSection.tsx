import { useState, useEffect } from "react";
import { Dumbbell, LoaderCircle, PackageX, Plus, Trash2 } from "lucide-react";
import { ExerciseEquipmentType } from "@/utils/ExerciseEquipmentType";
import { ExerciseType } from "@/utils/ExerciseType";
import { EquipmentService } from "@/hooks/equipment.service";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Pagination from "../../_components/Pagination";
import { EquipmentType } from "@/utils/EquipmentType";

type Props = {
  exercise: ExerciseType;
  equipments: ExerciseEquipmentType[];
  pagedEquipments: ExerciseEquipmentType[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onAdd: (payload: {
    equipmentId: string;
    equipmentName: string;
    required: boolean;
    alternative: boolean;
    quantity: number;
    usageNotes: string;
  }) => Promise<void>;
  onDelete: (exerciseEquipmentId: string, name: string) => void;
};

const BoolBadge = ({
  value,
  trueLabel,
  falseLabel,
  trueColor,
  falseColor,
}: any) => (
  <span
    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${value ? trueColor : falseColor}`}
  >
    {value ? trueLabel : falseLabel}
  </span>
);

const EMPTY = {
  equipmentId: "",
  required: false,
  alternative: false,
  quantity: 1,
  usageNotes: "",
};

const EquipmentSection = ({
  equipments,
  pagedEquipments,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onAdd,
  onDelete,
}: Props) => {
  const [allEquipments, setAllEquipments] = useState<EquipmentType[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    EquipmentService.getAll()
      .then(setAllEquipments)
      .catch(() => {});
  }, []);

  const handleAdd = async () => {
    if (!form.equipmentId) return;
    const eq = allEquipments.find((e) => e.equipmentId === form.equipmentId);
    if (!eq) return;
    await onAdd({ ...form, equipmentName: eq.name });
    setForm(EMPTY);
    setShowAdd(false);
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-orange-200 p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-orange-500">
          Thiết bị tập luyện
        </h2>
        <div className="flex items-center gap-3">
          {!isLoading && equipments.length > 0 && (
            <span className="text-xs text-gray-500">
              <span className="font-semibold text-orange-600">
                {equipments.length}
              </span>{" "}
              thiết bị
            </span>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowAdd((v) => !v)}
            className="text-orange-600 border-orange-200 hover:bg-orange-50 text-xs h-7"
          >
            <Plus size={14} className="mr-1" />
            Thêm
          </Button>
        </div>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="bg-orange-50 rounded-xl p-3 border border-orange-100 mb-3 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold">Thiết bị</Label>
              <Select
                value={form.equipmentId}
                onValueChange={(v) => setForm({ ...form, equipmentId: v })}
              >
                <SelectTrigger className="mt-1 text-xs bg-white">
                  <SelectValue placeholder="Chọn..." />
                </SelectTrigger>
                <SelectContent>
                  {allEquipments.map((eq) => (
                    <SelectItem key={eq.equipmentId} value={eq.equipmentId}>
                      {eq.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-semibold">Số lượng</Label>
              <Input
                className="mt-1 bg-white text-xs"
                type="number"
                min="1"
                value={form.quantity}
                onChange={(e) =>
                  setForm({ ...form, quantity: parseInt(e.target.value) || 1 })
                }
              />
            </div>
          </div>
          <div>
            <Label className="text-xs font-semibold">Ghi chú</Label>
            <Input
              className="mt-1 bg-white text-xs"
              value={form.usageNotes}
              onChange={(e) => setForm({ ...form, usageNotes: e.target.value })}
            />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-1.5 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={form.required}
                onChange={(e) =>
                  setForm({ ...form, required: e.target.checked })
                }
                className="w-3.5 h-3.5"
              />
              Bắt buộc
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={form.alternative}
                onChange={(e) =>
                  setForm({ ...form, alternative: e.target.checked })
                }
                className="w-3.5 h-3.5"
              />
              Thay thế được
            </label>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={!form.equipmentId}
              className="bg-orange-500 hover:bg-orange-600 text-white text-xs h-7"
            >
              Thêm
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAdd(false)}
              className="text-xs h-7"
            >
              Huỷ
            </Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <LoaderCircle size={24} className="animate-spin text-orange-400" />
        </div>
      ) : equipments.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-300 gap-2">
          <PackageX size={32} className="opacity-40" />
          <p className="text-xs text-gray-400">
            Bài tập này không cần thiết bị
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-orange-100 overflow-hidden flex-1">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-orange-50 text-orange-700">
                  <th className="text-left px-4 py-2.5 font-semibold">
                    Tên thiết bị
                  </th>
                  <th className="text-center px-3 py-2.5 font-semibold w-12">
                    SL
                  </th>
                  <th className="text-center px-3 py-2.5 font-semibold w-24">
                    Bắt buộc
                  </th>
                  <th className="text-center px-3 py-2.5 font-semibold w-24">
                    Thay thế
                  </th>
                  <th className="text-left px-4 py-2.5 font-semibold hidden md:table-cell">
                    Ghi chú
                  </th>
                  <th className="px-3 py-2.5 w-10" />
                </tr>
              </thead>
              <tbody>
                {pagedEquipments.map((eq, idx) => (
                  <tr
                    key={eq.exerciseEquipmentId}
                    className={`border-t border-orange-50 hover:bg-orange-50/40 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                  >
                    <td className="px-4 py-3 font-medium text-gray-700">
                      {eq.equipmentName}
                    </td>
                    <td className="px-3 py-3 text-center text-gray-600 font-semibold">
                      {eq.quantity}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <BoolBadge
                        value={eq.required}
                        trueLabel="Bắt buộc"
                        falseLabel="Không"
                        trueColor="bg-red-100 text-red-600"
                        falseColor="bg-gray-100 text-gray-400"
                      />
                    </td>
                    <td className="px-3 py-3 text-center">
                      <BoolBadge
                        value={eq.alternative}
                        trueLabel="Được"
                        falseLabel="Không"
                        trueColor="bg-blue-100 text-blue-600"
                        falseColor="bg-gray-100 text-gray-400"
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-400 hidden md:table-cell">
                      {eq.usageNotes || (
                        <span className="text-gray-200">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <button
                        onClick={() =>
                          onDelete(eq.exerciseEquipmentId, eq.equipmentName)
                        }
                        className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default EquipmentSection;
