"use client";

type Props = {
  text?: string;
  fullScreen?: boolean;
};

export const LoadingOverlay = ({
  text = "Đang tải...",
  fullScreen = true,
}: Props) => {
  return (
    <div
      className={`${
        fullScreen ? "fixed inset-0" : "absolute inset-0"
      } z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm`}
    >
      <div className="flex flex-col items-center gap-3 bg-white px-6 py-4 rounded-xl shadow-lg">
        {/* Spinner */}
        <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />

        {/* Text */}
        <span className="text-sm text-gray-600 font-medium">{text}</span>
      </div>
    </div>
  );
};
