"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import {
  StagedExercise,
  StagedLesson,
  ExerciseFormData,
  DEFAULT_EXERCISE_FORM,
  toStagedLessons,
} from "@/utils/StagedType";
import { CourseLessonDetailType } from "@/utils/CourseType";
import { ExerciseType } from "@/utils/ExerciseType";
import ExerciseForm from "./ExerciseForm";
import ExerciseList from "./ExerciseList";
import LessonList from "./LessonList";

export type LessonInfoRef = {
  getData: () => StagedLesson[];
};

type Props = {
  initialData?: CourseLessonDetailType[];
  exercises: ExerciseType[];
};

type LessonFormData = {
  name: string; // ✅ thêm name
  displayOrder: string;
  notes: string;
};

const DEFAULT_LESSON_FORM: LessonFormData = {
  name: "",
  displayOrder: "",
  notes: "",
};

const LessonInfo = forwardRef<LessonInfoRef, Props>(
  ({ initialData, exercises }, ref) => {
    const [lessons, setLessons] = useState<StagedLesson[]>(
      initialData ? toStagedLessons(initialData) : [],
    );

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
    const [lessonForm, setLessonForm] =
      useState<LessonFormData>(DEFAULT_LESSON_FORM);
    const [stagedExercises, setStagedExercises] = useState<StagedExercise[]>(
      [],
    );
    const [selectedExerciseId, setSelectedExerciseId] = useState("");
    const [exerciseForm, setExerciseForm] = useState<ExerciseFormData>(
      DEFAULT_EXERCISE_FORM,
    );

    useImperativeHandle(ref, () => ({ getData: () => lessons }));

    // ✅ Tính displayOrder mặc định không bị trùng
    const getNextDisplayOrder = () => {
      if (lessons.length === 0) return 1;
      return Math.max(...lessons.map((l) => l.displayOrder)) + 1;
    };

    // ── Dialog ────────────────────────────────────────────────────────────────

    const handleOpenDialog = (lessonId?: string) => {
      if (lessonId) {
        const lesson = lessons.find((l) => l.id === lessonId);
        if (!lesson) return;
        setEditingLessonId(lessonId);
        setLessonForm({
          name: lesson.name,
          displayOrder: String(lesson.displayOrder),
          notes: lesson.notes,
        });
        setStagedExercises(lesson.exercises);
      } else {
        setEditingLessonId(null);
        setLessonForm({
          name: "",
          displayOrder: String(getNextDisplayOrder()), // ✅ không trùng
          notes: "",
        });
        setStagedExercises([]);
      }
      setSelectedExerciseId("");
      setExerciseForm(DEFAULT_EXERCISE_FORM);
      setIsDialogOpen(true);
    };

    // ✅ Một hàm duy nhất xử lý đóng dialog — reset đầy đủ state
    const handleCloseDialog = () => {
      setIsDialogOpen(false);
      setEditingLessonId(null);
      setLessonForm(DEFAULT_LESSON_FORM);
      setStagedExercises([]);
      setSelectedExerciseId("");
      setExerciseForm(DEFAULT_EXERCISE_FORM);
    };

    // ── Exercise staging ──────────────────────────────────────────────────────

    const handleAddExercise = () => {
      if (!selectedExerciseId) return;
      const exercise = exercises.find(
        (e) => e.exerciseId === selectedExerciseId,
      );
      if (!exercise) return;

      setStagedExercises((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          exercise,
          displayOrder: prev.length + 1,
          sets: exerciseForm.sets ? parseInt(exerciseForm.sets) : null,
          reps: exerciseForm.reps ? parseInt(exerciseForm.reps) : null,
          durationSeconds: exerciseForm.durationSeconds
            ? parseInt(exerciseForm.durationSeconds)
            : null,
          restSeconds: exerciseForm.restSeconds
            ? parseInt(exerciseForm.restSeconds)
            : null,
          notes: exerciseForm.exerciseNotes || null,
          optional: exerciseForm.optional,
        },
      ]);
      setSelectedExerciseId("");
      setExerciseForm(DEFAULT_EXERCISE_FORM);
    };

    const handleRemoveExercise = (id: string) => {
      setStagedExercises((prev) => prev.filter((e) => e.id !== id));
    };

    // ── Lesson CRUD (local) ───────────────────────────────────────────────────

    const handleSaveLesson = () => {
      if (!lessonForm.name?.trim() || !lessonForm.displayOrder) return;
      const displayOrder = parseInt(lessonForm.displayOrder);

      if (editingLessonId) {
        setLessons((prev) =>
          prev.map((l) =>
            l.id === editingLessonId
              ? {
                  ...l,
                  name: lessonForm.name.trim(), // ✅ lưu name thực
                  displayOrder,
                  notes: lessonForm.notes,
                  exercises: stagedExercises,
                }
              : l,
          ),
        );
      } else {
        setLessons((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            name: lessonForm.name.trim(), // ✅ lưu name thực
            displayOrder,
            notes: lessonForm.notes,
            exercises: stagedExercises,
          },
        ]);
      }
      handleCloseDialog(); // ✅ dùng handleCloseDialog thay vì setIsDialogOpen(false)
    };

    const handleDeleteLesson = (lessonId: string) => {
      setLessons((prev) => prev.filter((l) => l.id !== lessonId));
    };

    // ── Render ────────────────────────────────────────────────────────────────

    return (
      <div className="space-y-6 mt-2 pt-6 border-t">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">Các bài học</h3>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              Tạo bài học và thêm bài tập trực tiếp vào từng buổi học.
            </p>
          </div>

          {/* ✅ onOpenChange route qua handleCloseDialog để reset state đúng */}
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              if (!open) handleCloseDialog();
            }}
          >
            <DialogTrigger asChild>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => handleOpenDialog()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm bài học
              </Button>
            </DialogTrigger>

            <DialogContent className="!max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle>
                  {editingLessonId ? "Chỉnh sửa bài học" : "Tạo bài học"}
                </DialogTitle>
                <DialogDescription>
                  Thêm chi tiết bài học và bài tập vào bài học này.
                </DialogDescription>
              </DialogHeader>

              <div className="flex-1 space-y-6 overflow-y-auto">
                {/* Thông tin bài học */}
                <div className="space-y-4">
                  {/* ✅ Field name mới */}
                  <div>
                    <Label
                      htmlFor="lesson-name"
                      className="text-sm font-semibold"
                    >
                      Tên bài học <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="lesson-name"
                      value={lessonForm.name}
                      onChange={(e) =>
                        setLessonForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Vd: Khởi động và làm nóng cơ thể"
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="order" className="text-sm font-semibold">
                      Thứ tự <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="order"
                      type="number"
                      min="1"
                      value={lessonForm.displayOrder}
                      onChange={(e) =>
                        setLessonForm((prev) => ({
                          ...prev,
                          displayOrder: e.target.value,
                        }))
                      }
                      placeholder="1"
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes" className="text-sm font-semibold">
                      Chú thích
                    </Label>
                    <Textarea
                      id="notes"
                      value={lessonForm.notes}
                      onChange={(e) =>
                        setLessonForm((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      placeholder="Vd: Hoàn thành trước khi chuyển sang bài học tiếp theo."
                      rows={2}
                      className="mt-1.5 resize-none"
                    />
                  </div>
                </div>

                {/* Bài tập */}
                <div className="border-t pt-6">
                  <h4 className="font-semibold text-base text-gray-900 mb-1">
                    Thêm bài tập cho bài học
                  </h4>
                  <p className="text-xs text-gray-500 mb-4">
                    Lựa chọn và cấu hình các bài tập cho bài học này
                  </p>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ExerciseForm
                      exercises={exercises}
                      selectedExerciseId={selectedExerciseId}
                      onExerciseSelect={setSelectedExerciseId}
                      formData={exerciseForm}
                      onFormChange={setExerciseForm}
                      onAddExercise={handleAddExercise}
                    />
                    <ExerciseList
                      stagedExercises={stagedExercises}
                      onRemoveExercise={handleRemoveExercise}
                    />
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="flex gap-3 pt-6 border-t mt-6 justify-end mr-2">
                  <Button variant="outline" onClick={handleCloseDialog}>
                    Hủy
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleSaveLesson}
                    disabled={
                      !lessonForm.name?.trim() || !lessonForm.displayOrder
                    }
                  >
                    {editingLessonId ? "Lưu thay đổi" : "Thêm bài học"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <LessonList
          lessons={lessons}
          onOpenDialog={handleOpenDialog}
          onDeleteLesson={handleDeleteLesson}
        />
      </div>
    );
  },
);

LessonInfo.displayName = "LessonInfo";
export default LessonInfo;
