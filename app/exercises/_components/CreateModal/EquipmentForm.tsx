"use client";

import { useEffect, useState } from "react";
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
import { Trash2, Plus } from "lucide-react";
import { EquipmentService } from "@/hooks/equipment.service";
import { StagedEquipment } from "./CreateModal";
import { EquipmentType } from "@/utils/EquipmentType";

type EquipForm = {
  equipmentId: string;
  required: boolean;
  alternative: boolean;
  quantity: number;
  usageNotes: string;
};

const EMPTY_FORM: EquipForm = {
  equipmentId: "",
  required: false,
  alternative: false,
  quantity: 1,
  usageNotes: "",
};

type Props = {
  stagedEquipments: StagedEquipment[];
  onChange: (list: StagedEquipment[]) => void;
};

const EquipmentForm = ({ stagedEquipments, onChange }: Props) => {
  const [equipments, setEquipments] = useState<EquipmentType[]>([]);
  const [form, setForm] = useState<EquipForm>(EMPTY_FORM);

  useEffect(() => {
    EquipmentService.getAll()
      .then(setEquipments)
      .catch(() => {});
  }, []);

  const handleAdd = () => {
    if (!form.equipmentId) return;
    const eq = equipments.find((e) => e.equipmentId === form.equipmentId);
    if (!eq) return;

    onChange([
      ...stagedEquipments,
      {
        id: Date.now().toString(),
        equipmentId: form.equipmentId,
        equipmentName: eq.name,
        required: form.required,
        alternative: form.alternative,
        quantity: form.quantity,
        usageNotes: form.usageNotes,
      },
    ]);
    setForm(EMPTY_FORM);
  };

  const handleRemove = (id: string) => {
    onChange(stagedEquipments.filter((e) => e.id !== id));
  };

  return (
    <div className="space-y-5">
      {/* Add form */}
      <div className="bg-orange-50 rounded-xl p-4 border border-orange-100 space-y-4">
        <h4 className="text-sm font-semibold text-orange-700">Thêm thiết bị</h4>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-semibold">
              Thiết bị <span className="text-red-500">*</span>
            </Label>
            <Select
              value={form.equipmentId}
              onValueChange={(v) => setForm({ ...form, equipmentId: v })}
            >
              <SelectTrigger className="mt-1.5 bg-white">
                <SelectValue placeholder="Chọn thiết bị..." />
              </SelectTrigger>
              <SelectContent>
                {equipments.map((eq) => (
                  <SelectItem key={eq.equipmentId} value={eq.equipmentId}>
                    {eq.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-semibold">Số lượng</Label>
            <Input
              className="mt-1.5 bg-white"
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
          <Label className="text-sm font-semibold">Ghi chú sử dụng</Label>
          <Input
            className="mt-1.5 bg-white"
            placeholder="Ghi chú thêm về thiết bị..."
            value={form.usageNotes}
            onChange={(e) => setForm({ ...form, usageNotes: e.target.value })}
          />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.required}
              onChange={(e) => setForm({ ...form, required: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm">Bắt buộc</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.alternative}
              onChange={(e) =>
                setForm({ ...form, alternative: e.target.checked })
              }
              className="w-4 h-4"
            />
            <span className="text-sm">Có thể thay thế</span>
          </label>
        </div>

        <Button
          type="button"
          onClick={handleAdd}
          disabled={!form.equipmentId}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          <Plus size={16} className="mr-2" />
          Thêm thiết bị
        </Button>
      </div>

      {/* Staged list */}
      {stagedEquipments.length > 0 && (
        <div className="rounded-xl border border-orange-100 overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-orange-50 text-orange-700">
                <th className="text-left px-4 py-2.5 font-semibold">Tên</th>
                <th className="text-center px-3 py-2.5 font-semibold">SL</th>
                <th className="text-center px-3 py-2.5 font-semibold">
                  Bắt buộc
                </th>
                <th className="text-center px-3 py-2.5 font-semibold">
                  Thay thế
                </th>
                <th className="text-left px-4 py-2.5 font-semibold">Ghi chú</th>
                <th className="px-3 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {stagedEquipments.map((eq) => (
                <tr
                  key={eq.id}
                  className="border-t border-orange-50 hover:bg-orange-50/40"
                >
                  <td className="px-4 py-3 font-medium text-gray-700">
                    {eq.equipmentName}
                  </td>
                  <td className="px-3 py-3 text-center">{eq.quantity}</td>
                  <td className="px-3 py-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${eq.required ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-400"}`}
                    >
                      {eq.required ? "Bắt buộc" : "Không"}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${eq.alternative ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"}`}
                    >
                      {eq.alternative ? "Được" : "Không"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {eq.usageNotes || "—"}
                  </td>
                  <td className="px-3 py-3">
                    <button
                      onClick={() => handleRemove(eq.id)}
                      className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EquipmentForm;
