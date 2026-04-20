import { FitnessGoalType } from "@/utils/FitnessGoalType";
import { Power, PowerOff } from "lucide-react";

type Props = {
  goal: FitnessGoalType;
  onPressFitnessGoal: (goal: FitnessGoalType) => void;
  updateStatusFitnessGoal: (goalId: string, isActive: boolean) => void;
};

const FitnessGoalRow = ({
  goal,
  onPressFitnessGoal,
  updateStatusFitnessGoal,
}: Props) => {
  const shortId = `${goal.goalId.slice(0, 6)}...`;

  return (
    <tr
      onClick={() => onPressFitnessGoal(goal)}
      className="border-b border-orange-100 hover:bg-orange-50 cursor-pointer"
    >
      <td className="py-3 px-4 text-gray-500 font-mono text-sm">{shortId}</td>
      <td className="py-3 px-4 text-gray-700 font-medium">
        {goal.vietnameseName}
      </td>
      {/* <td className="py-3 px-4 text-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            updateStatusFitnessGoal(goal.goalId, goal.isActive);
          }}
          className={`p-2 rounded-md transition inline-flex items-center justify-center ${
            goal.isActive
              ? "bg-red-100 text-red-600 hover:bg-red-200"
              : "bg-green-100 text-green-600 hover:bg-green-200"
          }`}
        >
          {goal.isActive ? <PowerOff size={16} /> : <Power size={16} />}
        </button>
      </td> */}
    </tr>
  );
};

export default FitnessGoalRow;
