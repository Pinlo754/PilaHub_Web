import { Dumbbell, LoaderCircle, PackageX } from "lucide-react";
import { ExerciseEquipmentType } from "@/utils/ExerciseEquipmentType";

type Props = {
  equipments: ExerciseEquipmentType[];
  isLoading: boolean;
};

const BoolBadge = ({
  value,
  trueLabel,
  falseLabel,
  trueColor,
  falseColor,
}: {
  value: boolean;
  trueLabel: string;
  falseLabel: string;
  trueColor: string;
  falseColor: string;
}) => (
  <span
    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${value ? trueColor : falseColor}`}
  >
    {value ? trueLabel : falseLabel}
  </span>
);

const EquipmentTab = ({ equipments, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoaderCircle size={26} className="animate-spin text-orange-400" />
      </div>
    );
  }

  if (equipments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-300 gap-3">
        <PackageX size={40} />
        <p className="text-sm text-gray-400">Bài tập này không cần thiết bị</p>
      </div>
    );
  }

  return (
    <div className="pt-3 space-y-4">
      {/* Summary */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Dumbbell size={13} className="text-orange-400" />
        <span>
          Tổng cộng{" "}
          <span className="font-semibold text-orange-600">
            {equipments.length}
          </span>{" "}
          thiết bị —{" "}
          <span className="text-red-500 font-medium">
            {equipments.filter((e) => e.required).length} bắt buộc
          </span>
          ,{" "}
          <span className="text-blue-500 font-medium">
            {equipments.filter((e) => e.alternative).length} có thể thay thế
          </span>
        </span>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-orange-100 overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-orange-50 text-orange-700">
              <th className="text-left px-4 py-2.5 font-semibold">
                Tên thiết bị
              </th>
              <th className="text-center px-3 py-2.5 font-semibold w-14">SL</th>
              <th className="text-center px-3 py-2.5 font-semibold w-24">
                Bắt buộc
              </th>
              <th className="text-center px-3 py-2.5 font-semibold w-28">
                Thay thế được
              </th>
              <th className="text-left px-4 py-2.5 font-semibold hidden md:table-cell">
                Ghi chú sử dụng
              </th>
            </tr>
          </thead>
          <tbody>
            {equipments.map((eq, idx) => (
              <tr
                key={eq.exerciseEquipmentId}
                className={`border-t border-orange-50 transition-colors hover:bg-orange-50/40 ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                }`}
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
                    trueLabel="Có"
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
                  {eq.usageNotes || <span className="text-gray-200">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EquipmentTab;
