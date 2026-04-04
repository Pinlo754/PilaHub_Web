import { CourseType } from "@/utils/CourseType";
import { formatLocalDateTime } from "@/utils/day";
import { formatVND } from "@/utils/number";
import { getActiveConfig, getLevelConfig } from "@/utils/uiMapper";

type Props = {
  course: CourseType; 
  onRowClick: (courseId: string) => void;
};

const CourseRow = ({ course, onRowClick }: Props) => {
  // VARIABLE
  const activeConfig = getActiveConfig(course.active);
  const levelConfig = getLevelConfig(course.level);

  return (
    <tr
      className="border-b border-orange-100 hover:bg-orange-50"
      onClick={() => onRowClick(course.courseId)}
    >
      <td className="py-3 px-4 text-gray-700">{course.courseId}</td>
      <td className="py-3 px-4 text-gray-700">{course.name}</td>
      <td className="py-3 px-4 text-center">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${levelConfig.bgColor} ${levelConfig.textColor}`}
        >
          {levelConfig.label}
        </span>
      </td>
      <td className="py-3 px-4 text-gray-700 text-center">
        {course.totalLesson}
      </td>
      <td className="py-3 px-4 text-gray-700 text-center font-medium">
        {formatVND(course.price)}
      </td>
      <td className="py-3 px-4 text-gray-700 text-center">
        {formatLocalDateTime(course.updatedAt)}
      </td>
      <td className="py-3 px-4 text-center">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${activeConfig.bgColor} ${activeConfig.textColor}`}
        >
          {activeConfig.label}
        </span>
      </td>
    </tr>
  );
};

export default CourseRow;
