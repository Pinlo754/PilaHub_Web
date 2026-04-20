// app/coaches/_components/DetailModal.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CoachType, FeedbackCoachType } from "@/utils/CoachType";
import { formatLocalDateTime } from "@/utils/day";
import { getGenderConfig } from "@/utils/uiMapper";
import { Star } from "lucide-react";
import Pagination from "./Pagination";

const PAGE_SIZE = 4;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coach: CoachType;
  feedbacks: FeedbackCoachType[];
};

const DetailModal = ({ open, onOpenChange, coach, feedbacks }: Props) => {
  const genderConfig = getGenderConfig(coach.gender);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(feedbacks.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedFeedbacks = feedbacks.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-5xl rounded-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-orange-700">
            Chi tiết huấn luyện viên
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 px-6 pb-6">
            {/* ===== LEFT COLUMN: COACH INFO ===== */}
            <div className="space-y-6 border-r-2 border-orange-100 pr-6">
              {/* PROFILE */}
              <div className="flex gap-4 items-start">
                <img
                  src={coach.avatarUrl || "/default-logo.png"}
                  alt={coach.fullName}
                  className="w-20 h-20 rounded-full object-cover border-2 border-orange-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {coach.fullName}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${genderConfig.bgColor} ${genderConfig.textColor}`}
                    >
                      {genderConfig.label}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        coach.active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {coach.active ? "Đang hoạt động" : "Đã khóa"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-2">
                <p
                  className={`text-sm text-gray-500 transition-all max-h-30 overflow-y-auto pr-1 `}
                >
                  {coach.bio}
                </p>
              </div>

              {/* STATS GRID */}
              <div className="grid grid-cols-2 gap-3">
                <StatCard label="Tuổi" value={`${coach.age}`} />
                <StatCard
                  label="Kinh nghiệm"
                  value={`${coach.yearsOfExperience} năm`}
                />
                <StatCard
                  label="Giá/giờ"
                  value={`${coach.pricePerHour.toLocaleString("vi-VN")}đ`}
                />
                <StatCard
                  label="Đánh giá TB"
                  value={coach.avgRating.toFixed(1)}
                  highlight
                />
              </div>

              {/* INFO */}
              <div className="border border-orange-100 rounded-xl p-4 space-y-2 text-sm bg-orange-50/40">
                <InfoRow label="Chuyên môn" value={coach.specialization} />
                <InfoRow
                  label="Chứng chỉ"
                  value={
                    <a
                      href={coach.certificationsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-orange-600 hover:underline truncate block"
                    >
                      Xem chứng chỉ
                    </a>
                  }
                />
                <InfoRow
                  label="Ngày đăng ký"
                  value={formatLocalDateTime(coach.createdAt, "date")}
                />
              </div>
            </div>

            {/* ===== RIGHT COLUMN: FEEDBACKS ===== */}
            <div className="flex flex-col pl-6">
              <h4 className="font-semibold text-gray-700 mb-3">
                Đánh giá từ học viên
                {feedbacks.length > 0 && (
                  <span className="ml-2 text-xs text-gray-400 font-normal">
                    ({feedbacks.length})
                  </span>
                )}
              </h4>

              {feedbacks.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8 flex-1 flex items-center justify-center">
                  Chưa có đánh giá nào
                </p>
              ) : (
                <>
                  <div className="space-y-3 flex-1 overflow-y-auto pr-2">
                    {paginatedFeedbacks.map((fb) => (
                      <FeedbackCard key={fb.feedbackId} feedback={fb} />
                    ))}
                  </div>

                  {/* PAGINATION */}
                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={(page) => {
                        setCurrentPage(page);
                      }}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ===== SUB COMPONENTS =====

const StatCard = ({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <div
    className={`rounded-xl p-3 text-center border ${
      highlight
        ? "bg-orange-50 border-orange-200"
        : "bg-gray-50 border-gray-100"
    }`}
  >
    <p
      className={`text-lg font-semibold ${
        highlight ? "text-orange-600" : "text-gray-800"
      }`}
    >
      {value}
    </p>
    <p className="text-xs text-gray-500 mt-0.5">{label}</p>
  </div>
);

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex justify-between items-center gap-4">
    <span className="text-gray-500 shrink-0">{label}</span>
    <span className="text-gray-700 text-right">{value}</span>
  </div>
);

const FeedbackCard = ({ feedback }: { feedback: FeedbackCoachType }) => (
  <div className="border border-gray-100 rounded-xl p-3 bg-white space-y-1.5">
    <div className="flex items-center gap-2">
      <img
        src={feedback.traineeAvatarUrl || "/default-logo.png"}
        alt={feedback.traineeFullName}
        className="w-7 h-7 rounded-full object-cover border"
      />
      <span className="text-sm font-medium text-gray-700">
        {feedback.traineeFullName}
      </span>
      <div className="ml-auto flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={12}
            className={
              i < feedback.rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-200"
            }
          />
        ))}
      </div>
    </div>
    {feedback.comment && (
      <p className="text-sm text-gray-500 pl-9">{feedback.comment}</p>
    )}
    <p className="text-xs text-gray-400 pl-9">
      {formatLocalDateTime(feedback.createdAt, "date")}
    </p>
  </div>
);

export default DetailModal;
