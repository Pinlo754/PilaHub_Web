import { ExerciseType } from "@/utils/ExerciseType";
import { formatLocalDateTime } from "@/utils/day";
import { convertSeconds, formatTime } from "@/utils/time";
import {
  getActiveConfig,
  getLevelConfig,
  getExerciseTypeConfig,
} from "@/utils/uiMapper";
import { Clock, Bot, Dumbbell } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  exercise: ExerciseType;
  onPressExercise: (exercise: ExerciseType) => void;
};

const ExerciseRow = ({ exercise, onPressExercise }: Props) => {
  // ROUTE
  const router = useRouter();
  const levelConfig = getLevelConfig(exercise.difficultyLevel);
  const typeConfig = getExerciseTypeConfig(exercise.exerciseType);
  const activeConfig = getActiveConfig(exercise.active);
  const shortId = `${exercise.exerciseId.slice(0, 6)}...`;
  const formattedTime = formatTime(convertSeconds(exercise.duration));

  const handleClick = () => {
    router.push(`/exercises/${exercise.exerciseId}`);
    // onPressExercise(exercise);
  };

  return (
    <tr
      onClick={handleClick}
      className="border-b border-orange-100 hover:bg-orange-50 cursor-pointer"
    >
      <td className="py-3 px-4 text-gray-500">{shortId}</td>
      <td className="py-3 px-4">
        <img
          src={exercise.imageUrl || "/default-logo.png"}
          alt={exercise.name}
          className="w-10 h-10 object-cover rounded-lg border mx-auto"
        />
      </td>
      <td className="py-3 px-4 text-gray-700 font-medium">{exercise.name}</td>
      <td className="py-3 px-4 text-center">
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${typeConfig.bgColor} ${typeConfig.textColor}`}
        >
          {typeConfig.label}
        </span>
      </td>
      <td className="py-3 px-4 text-center">
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${levelConfig.bgColor} ${levelConfig.textColor}`}
        >
          {levelConfig.label}
        </span>
      </td>
      <td className="py-3 px-4 text-center">
        <div className="flex items-center justify-center gap-1 text-gray-600 text-sm">
          {formattedTime}
        </div>
      </td>
      <td className="py-3 px-4 text-center">
        {exercise.equipmentRequired ? (
          <Dumbbell size={16} className="mx-auto text-orange-500" />
        ) : (
          <span className="text-gray-300 text-xs">—</span>
        )}
      </td>
      <td className="py-3 px-4 text-center">
        {exercise.haveAIsupported ? (
          <Bot size={16} className="mx-auto text-indigo-500" />
        ) : (
          <span className="text-gray-300 text-xs">—</span>
        )}
      </td>
      <td className="py-3 px-4 text-center">
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${activeConfig.bgColor} ${activeConfig.textColor}`}
        >
          {activeConfig.label}
        </span>
      </td>
      <td className="py-3 px-4 text-center text-gray-500 text-sm">
        {formatLocalDateTime(exercise.createdAt, "date")}
      </td>
    </tr>
  );
};

export default ExerciseRow;
