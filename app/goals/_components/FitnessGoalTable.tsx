import { FitnessGoalType } from "@/utils/FitnessGoalType";
import FitnessGoalRow from "./FitnessGoalRow";

type Props = {
  fitnessGoals: FitnessGoalType[];
  onPressFitnessGoal: (goal: FitnessGoalType) => void;
  updateStatusFitnessGoal: (goalId: string, isActive: boolean) => void;
};

const FitnessGoalTable = ({
  fitnessGoals,
  onPressFitnessGoal,
  updateStatusFitnessGoal,
}: Props) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b-2 border-orange-100">
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Mã
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Tên
          </th>
          {/* <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Hành động
          </th> */}
        </tr>
      </thead>
      <tbody>
        {fitnessGoals.map((goal) => (
          <FitnessGoalRow
            key={goal.goalId}
            goal={goal}
            onPressFitnessGoal={onPressFitnessGoal}
            updateStatusFitnessGoal={updateStatusFitnessGoal}
          />
        ))}
      </tbody>
    </table>
  );
};

export default FitnessGoalTable;
