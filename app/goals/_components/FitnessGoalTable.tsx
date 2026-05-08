import { FitnessGoalType } from "@/utils/FitnessGoalType";
import FitnessGoalRow from "./FitnessGoalRow";

type Props = {
  fitnessGoals: FitnessGoalType[];
  onPressFitnessGoal: (goal: FitnessGoalType) => void;
  updateStatusFitnessGoal: (goalId: string, isActive: boolean) => void;
  pageOffset: number; // ← THÊM: page * SIZE để tính STT đúng
};

const FitnessGoalTable = ({
  fitnessGoals,
  onPressFitnessGoal,
  updateStatusFitnessGoal,
  pageOffset,
}: Props) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b-2 border-orange-100">
          <th className="text-center py-3 px-4 font-semibold text-orange-700 w-16">
            STT
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Mã
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Tên
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Số mục đích
          </th>
          {/* <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Hành động
          </th> */}
        </tr>
      </thead>
      <tbody>
        {fitnessGoals.length === 0 ? (
          <tr>
            <td colSpan={4} className="text-center py-10 text-gray-400">
              Không có dữ liệu
            </td>
          </tr>
        ) : (
          fitnessGoals.map((goal, index) => (
            <FitnessGoalRow
              key={goal.goalId}
              goal={goal}
              index={pageOffset + index + 1}
              onPressFitnessGoal={onPressFitnessGoal}
              updateStatusFitnessGoal={updateStatusFitnessGoal}
            />
          ))
        )}
      </tbody>
    </table>
  );
};

export default FitnessGoalTable;
