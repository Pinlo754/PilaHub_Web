import { FitnessGoalType } from "@/utils/FitnessGoalType";

type Props = {
  goal: FitnessGoalType;
  index: number; // ← STT
  onPressFitnessGoal: (goal: FitnessGoalType) => void;
  updateStatusFitnessGoal: (goalId: string, isActive: boolean) => void;
};

const FitnessGoalRow = ({ goal, index, onPressFitnessGoal }: Props) => {
  return (
    <tr
      onClick={() => onPressFitnessGoal(goal)}
      className="border-b border-orange-100 hover:bg-orange-50 cursor-pointer"
    >
      <td className="py-3 px-4 text-center text-gray-400 text-sm">{index}</td>
      <td className="py-3 px-4 text-gray-500 font-mono text-sm">{goal.code}</td>
      <td className="py-3 px-4 text-gray-700 font-medium">
        {goal.vietnameseName}
      </td>
      <td className="py-3 px-4 text-center">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
          {goal.relatedPurposes?.length ?? 0}
        </span>
      </td>
    </tr>
  );
};

export default FitnessGoalRow;
