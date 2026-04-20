import { CourseType } from "@/utils/CourseType";
import { formatLocalDateTime } from "@/utils/day";
import { formatVND } from "@/utils/number";
import { getActiveConfig, getLevelConfig } from "@/utils/uiMapper";
import { Power, PowerOff, Trash2 } from "lucide-react";

type Props = {
  course: CourseType;
  onRowClick: (courseId: string) => void;
  onToggleStatus: (courseId: string, currentActive: boolean) => void;
  onDelete: (courseId: string, courseName: string) => void;
};

const CourseRow = ({ course, onRowClick, onDelete, onToggleStatus }: Props) => {
  // VARIABLE
  const activeConfig = getActiveConfig(course.active);
  const levelConfig = getLevelConfig(course.level);
  const shortId = `${course.courseId.slice(0, 6)}...`;

  return (
    <tr
      className="border-b border-orange-100 hover:bg-orange-50 cursor-pointer"
      onClick={() => onRowClick(course.courseId)}
    >
      <td className="py-3 px-4 text-gray-500">{shortId}</td>
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

      {/* Hành động */}
      <td className="py-3 px-4 text-center">
        <div
          className="flex items-center justify-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onToggleStatus(course.courseId, course.active)}
            className={`p-2 rounded-md transition inline-flex items-center justify-center ${
              course.active
                ? "bg-red-100 text-red-600 hover:bg-red-200"
                : "bg-green-100 text-green-600 hover:bg-green-200"
            }`}
            title={course.active ? "Tạm dừng" : "Kích hoạt"}
          >
            {course.active ? <Power size={16} /> : <PowerOff size={16} />}
          </button>
          <button
            onClick={() => onDelete(course.courseId, course.name)}
            className="p-2 rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200 transition inline-flex items-center justify-center"
            title="Xoá"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CourseRow;
