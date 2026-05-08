import { BodyPartType } from "@/utils/BodyPartType";
import BodyPartRow from "./BodyPartRow";

type Props = {
  bodyParts: BodyPartType[];
  startIndex: number;
  onPress: (bodyPart: BodyPartType) => void;
  onDelete: (bodyPartId: string, name: string) => void;
};

const BodyPartTable = ({ bodyParts, startIndex, onPress, onDelete }: Props) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b-2 border-orange-100">
          <th className="text-center py-3 px-4 font-semibold text-orange-700 w-16">
            STT
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Tên bộ phận
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Mô tả
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Ngày tạo
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Hành động
          </th>
        </tr>
      </thead>
      <tbody>
        {bodyParts.length === 0 ? (
          <tr>
            <td colSpan={5} className="text-center py-10 text-gray-400">
              Không có dữ liệu
            </td>
          </tr>
        ) : (
          bodyParts.map((bp, idx) => (
            <BodyPartRow
              key={bp.bodyPartId}
              bodyPart={bp}
              index={startIndex + idx + 1}
              onPress={onPress}
              onDelete={onDelete}
            />
          ))
        )}
      </tbody>
    </table>
  );
};

export default BodyPartTable;
