import { ExerciseType } from "@/utils/ExerciseType";
import ExerciseRow from "./ExerciseRow";

type Props = {
  exercises: ExerciseType[];
  onPressExercise: (exercise: ExerciseType) => void;
};

const ExerciseTable = ({ exercises, onPressExercise }: Props) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b-2 border-orange-100">
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Mã
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Ảnh
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Tên bài tập
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Loại
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Trình độ
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Thời lượng
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Thiết bị
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            AI
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Trạng thái
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Ngày tạo
          </th>
        </tr>
      </thead>
      <tbody>
        {exercises.length === 0 ? (
          <tr>
            <td colSpan={9} className="py-10 text-center text-gray-400 text-sm">
              Không có bài tập nào
            </td>
          </tr>
        ) : (
          exercises.map((ex) => (
            <ExerciseRow
              key={ex.exerciseId}
              exercise={ex}
              onPressExercise={onPressExercise}
            />
          ))
        )}
      </tbody>
    </table>
  );
};

export default ExerciseTable;
