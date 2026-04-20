"use client";

import { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CourseInfo, { CourseInfoRef } from "./CourseInfo";
import LessonInfo, { LessonInfoRef } from "./LessonInfo";
import { CourseModalPayload } from "../../useCourses";
import { CourseDetailType } from "@/utils/CourseType";
import { ExerciseType } from "@/utils/ExerciseType";
import { useToast } from "@/hooks/useToast";
import { useConfirm } from "@/hooks/useConfirm";
import Toast from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";

type Props = {
  open: boolean;
  isEditMode: boolean;
  initialData: CourseDetailType | undefined;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: CourseModalPayload) => void;
  exercises: ExerciseType[];
};

const DetailModal = ({
  open,
  isEditMode,
  initialData,
  onOpenChange,
  onSubmit,
  exercises,
}: Props) => {
  const courseInfoRef = useRef<CourseInfoRef>(null);
  const lessonInfoRef = useRef<LessonInfoRef>(null);

  const { toasts, removeToast, showError } = useToast();
  const { confirm, confirmState, isConfirmOpen, closeConfirm } = useConfirm();

  const handleSubmit = () => {
    const courseForm = courseInfoRef.current?.getData();
    const stagedLessons = lessonInfoRef.current?.getData() ?? [];

    // Validate đầy đủ các trường bắt buộc
    if (
      !courseForm?.name?.trim() ||
      !courseForm?.imageUrl?.trim() ||
      !courseForm?.description?.trim()
    ) {
      showError("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    // Validate price >= 0 (không âm)
    if (courseForm.price < 0) {
      showError("Giá khóa học không được nhỏ hơn 0");
      return;
    }

    const orderError = lessonInfoRef.current?.validate();
    if (orderError) {
      showError(`Lỗi thứ tự: ${orderError}`);
      return;
    }

    // Cảnh báo nếu không có lesson nào — tuỳ nghiệp vụ có thể bỏ check này
    if (stagedLessons.length === 0) {
      confirm({
        title: "Chưa có bài học",
        description: "Bạn chưa thêm bài học nào. Vẫn lưu khóa học?",
        variant: "warning",
        onConfirm: () => {
          onSubmit({ courseForm, stagedLessons });
        },
      });
      return;
    }

    onSubmit({ courseForm, stagedLessons });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(open) => !open && onOpenChange(false)}>
        <DialogContent className="!max-w-6xl w-full !max-h-[95vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-orange-700">
              {isEditMode ? "Chỉnh sửa khóa học" : "Tạo khóa học"}
            </DialogTitle>
          </DialogHeader>

          <CourseInfo
            key={initialData?.course.courseId ?? "create"}
            ref={courseInfoRef}
            initialData={initialData?.course}
          />

          <LessonInfo
            key={(initialData?.course.courseId ?? "create") + "-lessons"}
            ref={lessonInfoRef}
            initialData={initialData?.lessons}
            exercises={exercises}
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Huỷ
            </Button>
            <Button
              onClick={handleSubmit}
              variant="outline"
              className="bg-orange-50 text-orange-700 hover:bg-orange-200 hover:text-orange-700 disabled:opacity-50"
            >
              {isEditMode ? "Lưu thay đổi" : "Tạo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Toast UI */}
      <Toast toasts={toasts} onRemove={removeToast} />

      {/* Confirm Dialog */}
      {confirmState && (
        <ConfirmDialog
          open={isConfirmOpen}
          onOpenChange={closeConfirm}
          title={confirmState.title}
          description={confirmState.description}
          confirmLabel={confirmState.confirmLabel}
          variant={confirmState.variant}
          onConfirm={confirmState.onConfirm}
        />
      )}
    </>
  );
};

export default DetailModal;
