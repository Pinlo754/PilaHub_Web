import { Dumbbell, LoaderCircle, PackageX } from "lucide-react";
import { ExerciseEquipmentType } from "@/utils/ExerciseEquipmentType";

type Props = {
  equipments: ExerciseEquipmentType[];
  isLoading: boolean;
};

const EquipmentTable = ({ equipments, isLoading }: Props) => {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-2">
        <Dumbbell size={13} />
        Thiết bị tập luyện
      </div>

      {isLoading ? (
        <div className="flex justify-center py-6">
          <LoaderCircle size={20} className="animate-spin text-orange-400" />
        </div>
      ) : equipments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-5 text-gray-300 gap-1.5">
          <PackageX size={24} />
          <p className="text-xs">Không cần thiết bị</p>
        </div>
      ) : (
        <div className="rounded-xl border border-orange-100 overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-orange-50 text-orange-700">
                <th className="text-left px-3 py-2 font-semibold">
                  Tên thiết bị
                </th>
                <th className="text-center px-3 py-2 font-semibold">SL</th>
                <th className="text-center px-3 py-2 font-semibold">
                  Bắt buộc
                </th>
                <th className="text-center px-3 py-2 font-semibold">
                  Thay thế
                </th>
                <th className="text-left px-3 py-2 font-semibold hidden sm:table-cell">
                  Ghi chú
                </th>
              </tr>
            </thead>
            <tbody>
              {equipments.map((eq, idx) => (
                <tr
                  key={eq.exerciseEquipmentId}
                  className={`border-t border-orange-50 ${
                    idx % 2 === 0 ? "bg-white" : "bg-orange-50/30"
                  }`}
                >
                  <td className="px-3 py-2 font-medium text-gray-700">
                    {eq.equipmentName}
                  </td>
                  <td className="px-3 py-2 text-center text-gray-600">
                    {eq.quantity}
                  </td>
                  <td className="px-3 py-2 text-center">
                    {eq.required ? (
                      <span className="inline-block px-1.5 py-0.5 bg-red-100 text-red-600 rounded-full text-[10px] font-medium">
                        Có
                      </span>
                    ) : (
                      <span className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-400 rounded-full text-[10px] font-medium">
                        Không
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-center">
                    {eq.alternative ? (
                      <span className="inline-block px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded-full text-[10px] font-medium">
                        Có
                      </span>
                    ) : (
                      <span className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-400 rounded-full text-[10px] font-medium">
                        Không
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-gray-400 hidden sm:table-cell max-w-[160px] truncate">
                    {eq.usageNotes || "—"}
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

export default EquipmentTable;
