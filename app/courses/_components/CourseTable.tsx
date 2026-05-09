import { CourseType } from "@/utils/CourseType";
import CourseRow from "./CourseRow";

type Props = {
  courses: CourseType[];
  startIndex: number;
  onRowClick: (courseId: string) => void;
  onToggleStatus: (courseId: string, currentActive: boolean) => void;
  onDelete: (courseId: string, courseName: string) => void;
};

const CourseTable = ({
  courses,
  startIndex,
  onRowClick,
  onDelete,
  onToggleStatus,
}: Props) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b-2 border-orange-100">
          <th className="text-center py-3 px-4 font-semibold text-orange-700 w-14">
            STT
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Tên khóa học
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Cấp độ
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Số bài học
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Giá
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Ngày cập nhật
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Trạng thái
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Hành động
          </th>
        </tr>
      </thead>
      <tbody>
        {courses.map((course, idx) => {
          return (
            <CourseRow
              key={course.courseId}
              course={course}
              index={startIndex + idx + 1}
              onRowClick={onRowClick}
              onToggleStatus={onToggleStatus}
              onDelete={onDelete}
            />
          );
        })}
      </tbody>
    </table>
  );
};

export default CourseTable;
