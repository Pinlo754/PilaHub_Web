import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Plus, Edit2, Dumbbell } from "lucide-react";
import { StagedLesson } from "@/utils/StagedType";

type Props = {
  lessons: StagedLesson[];
  onOpenDialog: (lessonId?: string) => void;
  onDeleteLesson: (lessonId: string) => void;
};

const LessonList = ({ lessons, onOpenDialog, onDeleteLesson }: Props) => {
  return (
    <>
      {/* Empty state */}
      {lessons.length === 0 ? (
        <Card className="border-2 border-dashed border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <Dumbbell className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-lg font-semibold text-gray-900 mb-2">
              Chưa có bài học
            </p>
            <p className="text-sm text-gray-600 text-center mb-6 max-w-xs leading-relaxed">
              Tạo bài học đầu tiên của bạn và bắt đầu thêm các bài tập để xây
              dựng khóa học của mình.
            </p>
            <Button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
              onClick={() => onOpenDialog()}
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Tạo bài học đầu tiên
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Lesson cards */
        <div className="grid gap-4 max-h-[400px] overflow-y-auto pr-2 pb-4">
          {[...lessons]
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((lesson) => (
              <Card
                key={lesson.id}
                className="transition-all hover:shadow-lg border-l-4 border-l-blue-500 hover:border-l-blue-600 bg-gradient-to-r from-white to-blue-50"
              >
                <CardContent className="px-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        {/* Số thứ tự */}
                        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 font-bold text-lg shadow-sm flex-shrink-0">
                          {lesson.displayOrder}
                        </div>

                        <div className="flex-1">
                          {/* ✅ Hiển thị lesson.name thực thay vì hardcode */}
                          <h4 className="font-bold text-lg text-gray-900">
                            {lesson.name || `Bài học ${lesson.displayOrder}`}
                          </h4>

                          {lesson.notes && (
                            <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                              {lesson.notes}
                            </p>
                          )}

                          {/* Exercise tags */}
                          {lesson.exercises && lesson.exercises.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                                  <Dumbbell className="w-4 h-4" />
                                </div>
                                <p className="text-sm font-semibold text-green-700">
                                  {lesson.exercises.length} bài tập
                                </p>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {lesson.exercises.map((ex) => {
                                  const exerciseName =
                                    ex.exercise?.name ||
                                    "Bài tập không xác định";
                                  return (
                                    <span
                                      key={ex.id}
                                      className="inline-flex items-center text-xs bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 px-3 py-1.5 rounded-full border border-green-200 font-medium hover:shadow-sm transition-shadow"
                                    >
                                      {exerciseName}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 ml-4 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        onClick={() => onOpenDialog(lesson.id)}
                        title="Chỉnh sửa bài học"
                      >
                        <Edit2 className="w-4 h-4 mr-1.5" />
                        Sửa
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                        onClick={() => onDeleteLesson(lesson.id)}
                        title="Xóa bài học"
                      >
                        <Trash2 className="w-4 h-4 mr-1.5" />
                        Xóa
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </>
  );
};

export default LessonList;
