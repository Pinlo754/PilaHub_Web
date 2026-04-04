import { CourseService } from "@/hooks/course.service";
import { CourseLessonService } from "@/hooks/courseLesson.service";
import { ExerciseService } from "@/hooks/exercise.service";
import { LessonService } from "@/hooks/lesson.service";
import { LessonExerciseService } from "@/hooks/lessonExercise.service";
import {
  CourseDetailType,
  CourseType,
  CreateCourseReq,
} from "@/utils/CourseType";
import { ExerciseType } from "@/utils/ExerciseType";
import { StagedLesson } from "@/utils/StagedType";
import { useEffect, useState } from "react";

export type CourseModalPayload = {
  courseForm: CreateCourseReq;
  stagedLessons: StagedLesson[];
};

export const useCourses = () => {
  // STATE
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [exercises, setExercises] = useState<ExerciseType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<CourseDetailType | undefined>(
    undefined,
  );

  // VARIABLE
  const isEditMode = modalData !== null && modalData !== undefined;

  // API
  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const [resCourse, resExercise] = await Promise.all([
        CourseService.getAll(),
        ExerciseService.getAll(),
      ]);
      setCourses(resCourse);
      setExercises(resExercise);
    } catch (err: any) {
      if (err?.type === "BUSINESS_ERROR") {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Có lỗi xảy ra");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const createCourse = async ({
    courseForm,
    stagedLessons,
  }: CourseModalPayload) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      // 1. Tạo Course
      const createdCourse = await CourseService.createCourse(courseForm);

      // 2. Tạo từng Lesson tuần tự (phụ thuộc courseId),
      //    nhưng parallel các exercise bên trong mỗi lesson
      for (const staged of stagedLessons) {
        // 2a. Tạo Lesson với name thực từ staged
        const createdLesson = await LessonService.createLesson({
          name: staged.name,
          description: staged.notes || "",
        });

        // 2b. Thêm CourseLesson
        await CourseLessonService.addCourseLesson(createdCourse.courseId, [
          {
            lessonId: createdLesson.lessonId,
            displayOrder: staged.displayOrder,
            notes: staged.notes,
          },
        ]);

        // 2c. Parallel tất cả LessonExercise trong lesson này
        if (staged.exercises.length > 0) {
          await LessonExerciseService.addLessonExercise(
            createdLesson.lessonId,
            staged.exercises.map((ex) => ({
              exerciseId: ex.exercise.exerciseId,
              displayOrder: ex.displayOrder ?? 0,
              sets: ex.sets ?? 0,
              reps: ex.reps ?? 0,
              durationSeconds: ex.durationSeconds ?? 0,
              restSeconds: ex.restSeconds ?? 0,
              notes: ex.notes ?? "",
              optional: ex.optional,
            })),
          );
        }
      }

      closeModal();
      await fetchAll();
    } catch (err: any) {
      // Thông báo rõ lỗi giữa chừng để user biết cần kiểm tra lại
      setErrorMsg(
        err?.type === "BUSINESS_ERROR"
          ? err.message
          : "Tạo khóa học thất bại. Một phần dữ liệu có thể đã được lưu — vui lòng kiểm tra lại.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateCourse = async ({
    courseForm,
    stagedLessons,
  }: CourseModalPayload) => {
    if (!isEditMode) return;

    const courseId = modalData.course.courseId;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      // 1. Update course info
      await CourseService.updateCourse(courseId, courseForm);

      // Map lesson cũ theo displayOrder để lookup nhanh O(1)
      const existingLessonsMap = new Map(
        modalData.lessons.map((l) => [String(l.displayOrder), l]),
      );

      // 2. Loop stagedLessons
      for (const staged of stagedLessons) {
        const existing = existingLessonsMap.get(String(staged.displayOrder));

        // =============================
        // CASE 1: LESSON ĐÃ TỒN TẠI
        // =============================
        if (existing) {
          const lessonId = existing.lesson.lessonId;

          // 2.1 Update lesson info
          await LessonService.updateLesson(lessonId, {
            name: staged.name || `Bài học ${staged.displayOrder}`,
            description: staged.notes || "",
          });

          // 2.2 Update courseLesson
          await CourseLessonService.updateCourseLesson(
            existing.courseLessonId,
            {
              displayOrder: staged.displayOrder,
              notes: staged.notes,
            },
          );

          // Map exercise cũ
          const existingExMap = new Map(
            existing.exercises.map((e) => [e.exercise.exerciseId, e]),
          );

          const newExercises: any[] = [];

          // 2.3 Sync exercises
          for (const ex of staged.exercises) {
            const oldEx = existingExMap.get(ex.exercise.exerciseId);

            if (oldEx) {
              // Update existing exercise
              await LessonExerciseService.updateLessonExercise(
                oldEx.lessonExerciseId,
                {
                  displayOrder: ex.displayOrder ?? 0,
                  sets: ex.sets ?? 0,
                  reps: ex.reps ?? 0,
                  durationSeconds: ex.durationSeconds ?? 0,
                  restSeconds: ex.restSeconds ?? 0,
                  notes: ex.notes ?? "",
                  optional: ex.optional,
                },
              );
            } else {
              // Collect new exercise (batch create)
              newExercises.push({
                exerciseId: ex.exercise.exerciseId,
                displayOrder: ex.displayOrder ?? 0,
                sets: ex.sets ?? 0,
                reps: ex.reps ?? 0,
                durationSeconds: ex.durationSeconds ?? 0,
                restSeconds: ex.restSeconds ?? 0,
                notes: ex.notes ?? "",
                optional: ex.optional,
              });
            }
          }

          // Batch create new exercises
          if (newExercises.length > 0) {
            await LessonExerciseService.addLessonExercise(
              lessonId,
              newExercises,
            );
          }
        }

        // =============================
        // CASE 2: LESSON MỚI
        // =============================
        else {
          // 2.4 Create lesson
          const createdLesson = await LessonService.createLesson({
            name: staged.name || `Bài học ${staged.displayOrder}`,
            description: staged.notes || "",
          });

          const lessonId = createdLesson.lessonId;

          // addCourseLesson dùng ARRAY
          await CourseLessonService.addCourseLesson(courseId, [
            {
              lessonId,
              displayOrder: staged.displayOrder,
              notes: staged.notes,
            },
          ]);

          // Batch create exercises
          if (staged.exercises.length > 0) {
            await LessonExerciseService.addLessonExercise(
              lessonId,
              staged.exercises.map((ex) => ({
                exerciseId: ex.exercise.exerciseId,
                displayOrder: ex.displayOrder ?? 0,
                sets: ex.sets ?? 0,
                reps: ex.reps ?? 0,
                durationSeconds: ex.durationSeconds ?? 0,
                restSeconds: ex.restSeconds ?? 0,
                notes: ex.notes ?? "",
                optional: ex.optional,
              })),
            );
          }
        }
      }

      closeModal();
      await fetchAll();
    } catch (err: any) {
      setErrorMsg(
        err?.type === "BUSINESS_ERROR" ? err.message : "Cập nhật thất bại",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // HANDLER
  const openCreateModal = () => {
    setModalData(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (detail: CourseDetailType) => {
    setModalData(detail);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (modalData) {
      setModalData(undefined);
    }
  };

  const openDetailModal = () => {
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
  };

  const handleRowClick = async (courseId: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      // Mock tạm: dùng course có sẵn, lessons rỗng — sau này thay bằng getDetail
      const course = courses.find((c) => c.courseId === courseId);
      if (!course) return;
      const mockDetail: CourseDetailType = { course, lessons: [] };
      openEditModal(mockDetail);

      // Khi BE có API detail, thay bằng:
      // const detail = await CourseService.getDetail(courseId);
      // openEditModal(detail);
    } catch (err: any) {
      setErrorMsg(
        err?.type === "BUSINESS_ERROR" ? err.message : "Không thể tải chi tiết",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (payload: CourseModalPayload) =>
    isEditMode ? updateCourse(payload) : createCourse(payload);

  // USE EFFECT
  useEffect(() => {
    fetchAll();
  }, []);

  return {
    courses,
    isLoading,
    searchTerm,
    setSearchTerm,
    errorMsg,
    showDetailModal,
    openDetailModal,
    closeDetailModal,
    setShowDetailModal,
    createCourse,
    handleSubmit,
    isModalOpen,
    isEditMode,
    modalData,
    openCreateModal,
    openEditModal,
    closeModal,
    exercises,
    handleRowClick,
  };
};
