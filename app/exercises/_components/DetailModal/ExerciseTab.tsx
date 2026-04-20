import {
  CheckCircle,
  AlertTriangle,
  BookOpen,
  Clock,
  Dumbbell,
  Bot,
} from "lucide-react";
import { ExerciseType } from "@/utils/ExerciseType";
import {
  getLevelConfig,
  getExerciseTypeConfig,
  getBreathingRuleConfig,
  getActiveConfig,
} from "@/utils/uiMapper";
import { formatLocalDateTime } from "@/utils/day";
import StatCard from "./StatCard";
import TextBlock from "./TextBlock";
import { convertSeconds, formatTime } from "@/utils/time";

const ExerciseTab = ({ exercise }: { exercise: ExerciseType }) => {
  const levelConfig = getLevelConfig(exercise.difficultyLevel);
  const typeConfig = getExerciseTypeConfig(exercise.exerciseType);
  const activeConfig = getActiveConfig(exercise.active);
  const formattedTime = formatTime(convertSeconds(exercise.duration));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-3">
      {/* LEFT */}
      <div className="space-y-5">
        {/* Image + name + badges */}
        <div className="flex gap-4 items-start">
          <img
            src={exercise.imageUrl || "/default-logo.png"}
            alt={exercise.name}
            className="w-20 h-20 rounded-xl object-cover border-2 border-orange-100 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-800">
              {exercise.name}
            </h3>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeConfig.bgColor} ${typeConfig.textColor}`}
              >
                {typeConfig.label}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${levelConfig.bgColor} ${levelConfig.textColor}`}
              >
                {levelConfig.label}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${activeConfig.bgColor} ${activeConfig.textColor}`}
              >
                {activeConfig.label}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 leading-relaxed">
          {exercise.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <StatCard
            icon={<Clock size={14} />}
            label="Thời lượng"
            value={formattedTime}
          />
          <StatCard
            icon={<Dumbbell size={14} />}
            label="Thiết bị"
            value={exercise.equipmentRequired ? "Cần thiết bị" : "Không cần"}
            warn={exercise.equipmentRequired}
          />
          <StatCard
            icon={<Bot size={14} />}
            label="AI hỗ trợ"
            value={exercise.haveAIsupported ? "Có" : "Không"}
            highlight={exercise.haveAIsupported}
          />
        </div>

        {/* Body parts */}
        {exercise.bodyParts && exercise.bodyParts.length > 0 && (
          <div className="flex items-start justify-between gap-4">
            <p className="text-xs font-medium text-gray-500 mb-1.5">Nhóm cơ</p>
            <div className="flex flex-wrap gap-1.5">
              {exercise.bodyParts.map((bp) => (
                <span
                  key={bp.bodyPartId}
                  className="px-2 py-0.5 bg-orange-50 border border-orange-200 text-orange-700 rounded-full text-xs font-medium"
                >
                  {bp.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Breathing rule */}
        {exercise.breathingRule && (
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-gray-500 shrink-0">Quy tắc thở</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                getBreathingRuleConfig(exercise.breathingRule).bgColor
              } ${getBreathingRuleConfig(exercise.breathingRule).textColor}`}
            >
              {getBreathingRuleConfig(exercise.breathingRule).label}
            </span>
          </div>
        )}

        {/* AI model name
        {exercise.haveAIsupported && exercise.nameInModelAI && (
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-gray-500 shrink-0">
              Tên trong model AI
            </span>
            <code className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100">
              {exercise.nameInModelAI}
            </code>
          </div>
        )} */}

        <p className="text-xs text-gray-400">
          Ngày tạo: {formatLocalDateTime(exercise.createdAt, "date")}
        </p>
      </div>

      {/* RIGHT */}
      <div className="space-y-4 border-l-2 border-orange-100 pl-6">
        <TextBlock
          icon={<CheckCircle size={14} className="text-green-500" />}
          label="Lợi ích"
          content={exercise.benefits}
          color="green"
        />
        {exercise.prerequisites && (
          <TextBlock
            icon={<BookOpen size={14} className="text-blue-500" />}
            label="Điều kiện tiên quyết"
            content={exercise.prerequisites}
            color="blue"
          />
        )}
        {exercise.contraindications && (
          <TextBlock
            icon={<AlertTriangle size={14} className="text-red-500" />}
            label="Chống chỉ định"
            content={exercise.contraindications}
            color="red"
          />
        )}
      </div>
    </div>
  );
};

export default ExerciseTab;
