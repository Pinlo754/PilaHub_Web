import { AssessmentCriterionType } from "@/utils/AssessmentCriterionType";
import AssessmentCriterionRow from "./AssessmentCriterionRow";



type Props = {
  items: AssessmentCriterionType[];
  startIndex: number;
  onPress: (item: AssessmentCriterionType) => void;
  onToggleActive: (item: AssessmentCriterionType) => void;
};

const AssessmentCriterionTable = ({
  items,
  startIndex,
  onPress,
  onToggleActive,
}: Props) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b-2 border-orange-100">
          <th className="text-center py-3 px-4 font-semibold text-orange-700 w-14">
            STT
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Tên tiêu chí
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Mô tả
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700 w-24">
            Thứ tự
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700 w-36">
            Trạng thái
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700 w-28">
            Hành động
          </th>
        </tr>
      </thead>
      <tbody>
        {items.length === 0 ? (
          <tr>
            <td colSpan={6} className="text-center py-10 text-gray-400">
              Không có dữ liệu
            </td>
          </tr>
        ) : (
          items.map((item, idx) => (
            <AssessmentCriterionRow
              key={item.assessmentCriterionId}
              item={item}
              index={startIndex + idx + 1}
              onPress={onPress}
              onToggleActive={onToggleActive}
            />
          ))
        )}
      </tbody>
    </table>
  );
};

export default AssessmentCriterionTable;