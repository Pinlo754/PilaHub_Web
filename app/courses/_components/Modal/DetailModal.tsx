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

  const handleSubmit = () => {
    const courseForm = courseInfoRef.current?.getData();
    const stagedLessons = lessonInfoRef.current?.getData() ?? [];

    // Validate đầy đủ các trường bắt buộc
    if (
      !courseForm?.name?.trim() ||
      !courseForm?.imageUrl?.trim() ||
      !courseForm?.description?.trim()
    ) {
      return;
    }

    // Validate price >= 0 (không âm)
    if (courseForm.price < 0) {
      return;
    }

    // Cảnh báo nếu không có lesson nào — tuỳ nghiệp vụ có thể bỏ check này
    if (stagedLessons.length === 0) {
      const confirmed = window.confirm(
        "Bạn chưa thêm bài học nào. Vẫn tạo khóa học?",
      );
      if (!confirmed) return;
    }

    onSubmit({ courseForm, stagedLessons });
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onOpenChange(false)}>
      <DialogContent className="!max-w-6xl w-full rounded-2xl">
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
  );
};

export default DetailModal;
