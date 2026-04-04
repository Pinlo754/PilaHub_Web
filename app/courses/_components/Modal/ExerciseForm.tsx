import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Dumbbell, Clock, RotateCw, Zap } from "lucide-react";
import { ExerciseType } from "@/utils/ExerciseType";
import { ExerciseFormData } from "@/utils/StagedType";
import { getLevelLabel } from "@/utils/uiMapper";

type Props = {
  exercises: ExerciseType[];
  selectedExerciseId: string;
  onExerciseSelect: (id: string) => void;
  formData: ExerciseFormData;
  onFormChange: (data: ExerciseFormData) => void;
  onAddExercise: () => void;
};

const ExerciseForm = ({
  exercises,
  selectedExerciseId,
  onExerciseSelect,
  formData,
  onFormChange,
  onAddExercise,
}: Props) => {
  const selectedExercise = exercises.find(
    (e) => e.exerciseId === selectedExerciseId,
  );

  return (
    <div className="lg:col-span-1 space-y-4 max-h-[400px] overflow-y-auto">
      {/* Exercise picker */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100 flex gap-3 items-center">
        <Label
          htmlFor="exercise-select"
          className="text-sm font-semibold block mb-2"
        >
          Chọn bài tập <span className="text-red-500">*</span>
        </Label>
        <Select value={selectedExerciseId} onValueChange={onExerciseSelect}>
          <SelectTrigger
            id="exercise-select"
            className="bg-white border-2 border-blue-200 hover:border-blue-300 w-[75%]"
          >
            <SelectValue placeholder="Tìm kiếm và chọn một bài tập..." />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto">
            {exercises.map((exercise) => (
              <SelectItem key={exercise.exerciseId} value={exercise.exerciseId}>
                <div className="flex flex-col">
                  <p className="font-medium">{exercise.name}</p>
                  <p className="text-xs text-gray-500">
                    Độ khó: {getLevelLabel(exercise.difficultyLevel)}
                  </p>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Exercise preview */}
      {selectedExercise && (
        <Card className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-blue-200 shadow-sm">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="mt-1 p-2 rounded bg-blue-100">
                  <Dumbbell className="w-4 h-4 text-blue-700" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {selectedExercise.name}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {selectedExercise.description}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="bg-white rounded p-2 border border-gray-200">
                  <p className="text-xs text-gray-600">Loại bài tập</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">
                    {selectedExercise.exerciseType}
                  </p>
                </div>
                <div className="bg-white rounded p-2 border border-gray-200">
                  <p className="text-xs text-gray-600">Bộ phận cơ thể</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">
                    {selectedExercise.bodyParts
                      ?.map((b) => b.name)
                      .join(", ") || "Không có"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Config params */}
      {selectedExercise && (
        <div className="space-y-4">
          <div>
            <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Cấu hình tham số bài tập
            </h5>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-3 border border-gray-200 hover:border-blue-300 transition-colors">
                <Label
                  htmlFor="sets"
                  className="text-xs font-semibold text-gray-700 block mb-2"
                >
                  Sets
                </Label>
                <Input
                  id="sets"
                  type="number"
                  min="0"
                  value={formData.sets}
                  onChange={(e) =>
                    onFormChange({ ...formData, sets: e.target.value })
                  }
                  placeholder="3"
                  className="border-blue-200 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Số lần lặp lại</p>
              </div>

              <div className="bg-white rounded-lg p-3 border border-gray-200 hover:border-blue-300 transition-colors">
                <Label
                  htmlFor="reps"
                  className="text-xs font-semibold text-gray-700 block mb-2"
                >
                  Reps
                </Label>
                <Input
                  id="reps"
                  type="number"
                  min="0"
                  value={formData.reps}
                  onChange={(e) =>
                    onFormChange({ ...formData, reps: e.target.value })
                  }
                  placeholder="12"
                  className="border-blue-200 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Lần lặp mỗi set</p>
              </div>

              <div className="bg-white rounded-lg p-3 border border-gray-200 hover:border-blue-300 transition-colors">
                <Label
                  htmlFor="duration"
                  className="text-xs font-semibold text-gray-700 block mb-2 flex items-center gap-1"
                >
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  Thời gian
                </Label>
                <Input
                  id="duration"
                  type="number"
                  min="0"
                  value={formData.durationSeconds}
                  onChange={(e) =>
                    onFormChange({
                      ...formData,
                      durationSeconds: e.target.value,
                    })
                  }
                  placeholder="60"
                  className="border-blue-200 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Giây</p>
              </div>

              <div className="bg-white rounded-lg p-3 border border-gray-200 hover:border-blue-300 transition-colors">
                <Label
                  htmlFor="rest"
                  className="text-xs font-semibold text-gray-700 block mb-2 flex items-center gap-1"
                >
                  <RotateCw className="w-3.5 h-3.5 text-green-500" />
                  Thời gian nghỉ
                </Label>
                <Input
                  id="rest"
                  type="number"
                  min="0"
                  value={formData.restSeconds}
                  onChange={(e) =>
                    onFormChange({ ...formData, restSeconds: e.target.value })
                  }
                  placeholder="30"
                  className="border-blue-200 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Giây</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notes + optional + submit */}
      {selectedExercise && (
        <div className="space-y-3">
          <div>
            <Label
              htmlFor="exercise-notes"
              className="text-xs font-semibold text-gray-700 block mb-2"
            >
              Ghi chú bài tập
            </Label>
            <Input
              id="exercise-notes"
              value={formData.exerciseNotes}
              onChange={(e) =>
                onFormChange({ ...formData, exerciseNotes: e.target.value })
              }
              placeholder="Ví dụ: Chú ý đến kỹ thuật, giữ tư thế cơ thể thẳng..."
              className="border-blue-200 focus:border-blue-500 text-sm"
            />
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-blue-50 transition-colors">
            <input
              type="checkbox"
              checked={formData.optional}
              onChange={(e) =>
                onFormChange({ ...formData, optional: e.target.checked })
              }
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-900 block">
                Bài tập tùy chọn
              </span>
              <span className="text-xs text-gray-500">
                Người dùng có thể bỏ qua bài tập này
              </span>
            </div>
          </label>

          <Button
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-md hover:shadow-lg transition-all"
            onClick={onAddExercise}
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Thêm bài tập vào buổi học
          </Button>
        </div>
      )}
    </div>
  );
};

export default ExerciseForm;
