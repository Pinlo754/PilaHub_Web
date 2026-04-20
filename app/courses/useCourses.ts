import { CourseService } from "@/hooks/course.service";
import { CourseLessonService } from "@/hooks/courseLesson.service";
import { ExerciseService } from "@/hooks/exercise.service";
import { LessonService } from "@/hooks/lesson.service";
import { LessonExerciseService } from "@/hooks/lessonExercise.service";
import { useConfirm } from "@/hooks/useConfirm";
import { useToast } from "@/hooks/useToast";
import {
  CourseDetailType,
  CourseType,
  CreateCourseReq,
  LevelType,
} from "@/utils/CourseType";
import { ExerciseType } from "@/utils/ExerciseType";
import { StagedLesson } from "@/utils/StagedType";
import { useEffect, useRef, useState } from "react";

export type CourseModalPayload = {
  courseForm: CreateCourseReq;
  stagedLessons: StagedLesson[];
};

const PAGE_SIZE = 10;

export const useCourses = () => {
  // STATE
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [exercises, setExercises] = useState<ExerciseType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState<LevelType | "">("");
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<CourseDetailType | undefined>(
    undefined,
  );

  // TOAST & CONFIRM
  const { toasts, removeToast, showSuccess, showError } = useToast();
  const { confirmState, isConfirmOpen, confirm, closeConfirm } = useConfirm();

  // VARIABLE
  const isEditMode = modalData !== null && modalData !== undefined;

  // Debounce ref for search
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      const msg =
        err?.type === "BUSINESS_ERROR" ? err.message : "Có lỗi xảy ra";
      showError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchByLevel = async (level: LevelType) => {
    setIsLoading(true);
    try {
      const res = await CourseService.getByLevel(level);
      setCourses(res);
    } catch (err: any) {
      const msg =
        err?.type === "BUSINESS_ERROR" ? err.message : "Có lỗi xảy ra";
      showError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchByName = async (name: string) => {
    setIsLoading(true);
    try {
      const res = await CourseService.searchByName(name);
      setCourses(res);
    } catch (err: any) {
      // If no results found, show empty
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createCourse = async ({
    courseForm,
    stagedLessons,
  }: CourseModalPayload) => {
    setIsLoading(true);
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
      showSuccess("Tạo khóa học thành công!");
    } catch (err: any) {
      // Thông báo rõ lỗi giữa chừng để user biết cần kiểm tra lại
      const msg =
        err?.type === "BUSINESS_ERROR"
          ? err.message
          : "Tạo khóa học thất bại. Một phần dữ liệu có thể đã được lưu — vui lòng kiểm tra lại.";
      showError(msg);
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
    const originalCourse = modalData.course;

    setIsLoading(true);
    try {
      // ── 1. Update course nếu có thay đổi ──────────────────────────────────
      const courseChanged =
        courseForm.name !== originalCourse.name ||
        courseForm.description !== originalCourse.description ||
        courseForm.imageUrl !== originalCourse.imageUrl ||
        courseForm.level !== originalCourse.level ||
        courseForm.price !== originalCourse.price;

      if (courseChanged) {
        await CourseService.updateCourse(courseId, courseForm);
      }

      // ── 2. Xác định lessons bị xóa → gọi API delete ───────────────────────
      const stagedLessonOrderSet = new Set(
        stagedLessons.map((l) => String(l.displayOrder)),
      );

      const deletedLessons = modalData.lessons.filter(
        (l) => !stagedLessonOrderSet.has(String(l.displayOrder)),
      );

      for (const deleted of deletedLessons) {
        // Xóa tất cả lesson exercises trước
        for (const ex of deleted.exercises) {
          await LessonExerciseService.deleteLessonExercise(ex.lessonExerciseId);
        }
        // Xóa course lesson mapping
        await CourseLessonService.deleteCourseLesson(deleted.courseLessonId);
        // Xóa lesson
        await LessonService.deleteLesson(deleted.lesson.lessonId);
      }

      // ── 3. Sync từng staged lesson ─────────────────────────────────────────
      const existingLessonsMap = new Map(
        modalData.lessons.map((l) => [String(l.displayOrder), l]),
      );

      for (const staged of stagedLessons) {
        const existing = existingLessonsMap.get(String(staged.displayOrder));

        // CASE 1: LESSON ĐÃ TỒN TẠI
        if (existing) {
          const lessonId = existing.lesson.lessonId;

          const lessonChanged =
            staged.name !== existing.lesson.name ||
            (staged.notes || "") !== (existing.notes || "");

          if (lessonChanged) {
            await LessonService.updateLesson(lessonId, {
              name: staged.name || `Bài học ${staged.displayOrder}`,
              description: staged.notes || "",
            });
          }

          const courseLessonChanged =
            staged.displayOrder !== existing.displayOrder ||
            (staged.notes || "") !== (existing.notes || "");

          if (courseLessonChanged) {
            await CourseLessonService.updateCourseLesson(
              existing.courseLessonId,
              {
                displayOrder: staged.displayOrder,
                notes: staged.notes,
              },
            );
          }

          // ── Sync exercises ─────────────────────────────────────────────────
          const existingExMap = new Map(
            existing.exercises.map((e) => [e.exercise.exerciseId, e]),
          );
          const stagedExIdSet = new Set(
            staged.exercises.map((e) => e.exercise.exerciseId),
          );

          // Xóa exercises không còn trong staged
          for (const [exId, oldEx] of existingExMap.entries()) {
            if (!stagedExIdSet.has(exId)) {
              await LessonExerciseService.deleteLessonExercise(
                oldEx.lessonExerciseId,
              );
            }
          }

          const newExercises: any[] = [];

          for (const ex of staged.exercises) {
            const oldEx = existingExMap.get(ex.exercise.exerciseId);

            if (oldEx) {
              const exChanged =
                (ex.displayOrder ?? 0) !== (oldEx.displayOrder ?? 0) ||
                (ex.sets ?? 0) !== (oldEx.sets ?? 0) ||
                (ex.reps ?? 0) !== (oldEx.reps ?? 0) ||
                (ex.durationSeconds ?? 0) !== (oldEx.durationSeconds ?? 0) ||
                (ex.restSeconds ?? 0) !== (oldEx.restSeconds ?? 0) ||
                (ex.notes ?? "") !== (oldEx.notes ?? "");

              if (exChanged) {
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
              }
            } else {
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

          if (newExercises.length > 0) {
            await LessonExerciseService.addLessonExercise(
              lessonId,
              newExercises,
            );
          }
        }

        // CASE 2: LESSON MỚI
        else {
          const createdLesson = await LessonService.createLesson({
            name: staged.name || `Bài học ${staged.displayOrder}`,
            description: staged.notes || "",
          });

          const lessonId = createdLesson.lessonId;

          await CourseLessonService.addCourseLesson(courseId, [
            {
              lessonId,
              displayOrder: staged.displayOrder,
              notes: staged.notes,
            },
          ]);

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
      showSuccess("Cập nhật khóa học thành công!");
    } catch (err: any) {
      showError(
        err?.type === "BUSINESS_ERROR" ? err.message : "Cập nhật thất bại",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCourseStatus = (courseId: string, currentActive: boolean) => {
    confirm({
      title: currentActive ? "Tạm dừng khóa học?" : "Kích hoạt khóa học?",
      description: currentActive
        ? "Khóa học sẽ bị ẩn khỏi danh sách hiển thị."
        : "Khóa học sẽ được hiển thị trở lại.",
      variant: currentActive ? "warning" : "info",
      confirmLabel: currentActive ? "Tạm dừng" : "Kích hoạt",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          if (currentActive) {
            await CourseService.deactiveCourse(courseId);
            showSuccess("Đã tạm dừng khóa học.");
          } else {
            await CourseService.activeCourse(courseId);
            showSuccess("Đã kích hoạt khóa học.");
          }
          await fetchAll();
        } catch (err: any) {
          showError(
            err?.type === "BUSINESS_ERROR" ? err.message : "Thao tác thất bại",
          );
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const deleteCourse = (courseId: string, courseName: string) => {
    confirm({
      title: "Xoá khóa học?",
      description: `Bạn sắp xoá "${courseName}". Hành động này không thể hoàn tác.`,
      variant: "danger",
      confirmLabel: "Xoá",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          await CourseService.deleteCourse(courseId);
          showSuccess("Đã xoá khóa học.");
          await fetchAll();
        } catch (err: any) {
          showError(
            err?.type === "BUSINESS_ERROR" ? err.message : "Xoá thất bại",
          );
        } finally {
          setIsLoading(false);
        }
      },
    });
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
    try {
      const detail = await CourseService.getById(courseId);
      openEditModal(detail);
    } catch (err: any) {
      const msg =
        err?.type === "BUSINESS_ERROR" ? err.message : "Không thể tải chi tiết";
      showError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    searchDebounceRef.current = setTimeout(async () => {
      if (!value.trim()) {
        if (filterLevel) {
          await fetchByLevel(filterLevel);
        } else {
          await fetchAll();
        }
      } else {
        await fetchByName(value.trim());
      }
    }, 400);
  };

  const handleFilterLevelChange = async (level: LevelType | "") => {
    setFilterLevel(level);
    setSearchTerm("");
    setCurrentPage(1);

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    if (level) {
      await fetchByLevel(level);
    } else {
      await fetchAll();
    }
  };

  const handleSubmit = (payload: CourseModalPayload) =>
    isEditMode ? updateCourse(payload) : createCourse(payload);

  // PAGINATION
  const totalPages = Math.max(1, Math.ceil(courses.length / PAGE_SIZE));
  const paginatedCourses = courses.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  // USE EFFECT
  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return {
    courses: paginatedCourses,
    isLoading,
    searchTerm,
    setSearchTerm: handleSearchChange,
    filterLevel,
    setFilterLevel: handleFilterLevelChange,
    showDetailModal,
    openDetailModal,
    closeDetailModal,
    setShowDetailModal,
    createCourse,
    handleSubmit,
    toggleCourseStatus,
    deleteCourse,
    isModalOpen,
    isEditMode,
    modalData,
    openCreateModal,
    openEditModal,
    closeModal,
    exercises,
    handleRowClick,
    // Toast
    toasts,
    removeToast,
    // Confirm
    confirmState,
    isConfirmOpen,
    confirm,
    closeConfirm,
    currentPage,
    totalPages,
    setCurrentPage,
  };
};
