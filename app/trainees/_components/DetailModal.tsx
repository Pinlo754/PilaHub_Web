"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TraineeType } from "@/utils/TraineeType";
import { formatLocalDateTime } from "@/utils/day";
import {
  getGenderConfig,
  getWorkoutLevelConfig,
  getWorkoutFrequencyConfig,
} from "@/utils/uiMapper";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trainee: TraineeType;
};

const DetailModal = ({ open, onOpenChange, trainee }: Props) => {
  const genderConfig = getGenderConfig(trainee.gender);
  const levelConfig = getWorkoutLevelConfig(trainee.workoutLevel);
  const freqConfig = getWorkoutFrequencyConfig(trainee.workoutFrequency);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-orange-700">
            Chi tiết học viên
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* ===== PROFILE ===== */}
          <div className="flex gap-4 items-center">
            <img
              src={trainee.avatarUrl || "/default-logo.png"}
              alt={trainee.fullName}
              className="w-20 h-20 rounded-full object-cover border-2 border-orange-100 shrink-0"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {trainee.fullName}
              </h3>
              <div className="flex flex-wrap gap-2 mt-1">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${genderConfig.bgColor} ${genderConfig.textColor}`}
                >
                  {genderConfig.label}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  {trainee.age} tuổi
                </span>
              </div>
            </div>
          </div>

          {/* ===== STATS ===== */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">Trình độ tập luyện</p>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${levelConfig.bgColor} ${levelConfig.textColor}`}
              >
                {levelConfig.label}
              </span>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">Tần suất tập</p>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${freqConfig.bgColor} ${freqConfig.textColor}`}
              >
                {freqConfig.label}
              </span>
            </div>
          </div>

          {/* ===== INFO ===== */}
          <div className="border border-orange-100 rounded-xl p-4 space-y-2 text-sm bg-orange-50/40">
            <div className="flex justify-between">
              <span className="text-gray-500">Mã học viên</span>
              <span className="font-mono text-gray-600 text-xs">
                {trainee.traineeId}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Ngày đăng ký</span>
              <span className="text-gray-700">
                {formatLocalDateTime(trainee.createdAt, "date")}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetailModal;
