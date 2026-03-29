import { Button } from "@/components/ui/button";
import { StagedExercise } from "@/utils/StagedType";
import { Clock, RotateCw, Dumbbell, Trash2 } from "lucide-react";

type Props = {
  stagedExercises: StagedExercise[];
  onRemoveExercise: (id: string) => void;
};

const ExerciseList = ({ stagedExercises, onRemoveExercise }: Props) => {
  return (
    <div className="lg:col-span-1 max-h-[400px] overflow-y-auto">
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200 sticky top-0 ">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">
            {stagedExercises.length}
          </div>
          <h5 className="font-semibold text-sm text-gray-900">
            Bài tập trong bài học
          </h5>
        </div>

        {/* Empty state */}
        {stagedExercises.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Dumbbell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">Chưa có bài tập</p>
            <p className="text-xs mt-1">Thêm bài tập từ bên trái</p>
          </div>
        )}

        {/* Exercise items */}
        {stagedExercises.length > 0 && (
          <div className="space-y-2">
            {stagedExercises.map((exercise, index) => (
              <div
                key={exercise.id}
                className="flex items-start justify-between p-3 bg-white rounded-lg border border-green-200 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold text-xs mt-0.5">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {exercise.exercise?.name}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {exercise.sets && (
                        <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-200">
                          <span className="font-semibold">{exercise.sets}</span>
                          <span>sets</span>
                        </span>
                      )}
                      {exercise.reps && (
                        <span className="inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full border border-purple-200">
                          <span className="font-semibold">{exercise.reps}</span>
                          <span>reps</span>
                        </span>
                      )}
                      {exercise.durationSeconds && (
                        <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full border border-amber-200">
                          <Clock className="w-3 h-3" />
                          <span>{exercise.durationSeconds}s</span>
                        </span>
                      )}
                      {exercise.restSeconds && (
                        <span className="inline-flex items-center gap-1 text-xs bg-cyan-50 text-cyan-700 px-2 py-1 rounded-full border border-cyan-200">
                          <RotateCw className="w-3 h-3" />
                          <span>{exercise.restSeconds}s</span>
                        </span>
                      )}
                    </div>
                    {exercise.notes && (
                      <p className="text-xs text-gray-600 mt-2 italic">
                        💬 {exercise.notes}
                      </p>
                    )}
                    {exercise.optional && (
                      <p className="text-xs text-amber-600 mt-2 font-medium">
                        ✓ Bài tập tùy chọn
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2"
                  onClick={() => onRemoveExercise(exercise.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseList;
