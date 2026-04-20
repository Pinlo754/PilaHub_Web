"use client";

import { useRef, useState } from "react";
import { CheckFileRes } from "@/utils/AiDocumentType";
import {
  Download,
  Upload,
  Loader2,
  FileText,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";

const ALLOWED_MIME_TYPES = [
  "text/markdown",
  "text/plain",
  "application/pdf",
  // Some browsers use these for .md files
  "text/x-markdown",
  "application/octet-stream",
];

const ALLOWED_EXTENSIONS = [".md", ".txt", ".pdf"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

const validateFile = (file: File): string | null => {
  const ext = "." + file.name.split(".").pop()?.toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return `Định dạng không hợp lệ. Chỉ chấp nhận: Markdown (.md), Text (.txt), PDF (.pdf)`;
  }
  if (file.size > MAX_SIZE_BYTES) {
    return `File vượt quá giới hạn 10MB (hiện tại: ${(file.size / (1024 * 1024)).toFixed(1)}MB)`;
  }
  return null;
};

type SectionKey = "roadmap" | "scoring" | "workout";

type SectionConfig = {
  key: SectionKey;
  label: string;
  description: string;
};

const SECTIONS: SectionConfig[] = [
  {
    key: "roadmap",
    label: "Roadmap Reference",
    description: "Tài liệu tham chiếu lộ trình học tập",
  },
  {
    key: "scoring",
    label: "Scoring Guideline",
    description: "Hướng dẫn chấm điểm AI",
  },
  {
    key: "workout",
    label: "Workout Feedback Reference",
    description: "Tài liệu phản hồi bài tập",
  },
];

type Props = {
  roadmapStatus: CheckFileRes | null;
  scoringStatus: CheckFileRes | null;
  workoutStatus: CheckFileRes | null;
  checkingSection: string | null;
  activeSection: string | null;
  uploadingSection: string | null;
  onCheck: (section: string) => void;
  onUpload: (section: string, file: File) => void;
  onDownload: (section: string) => void;
  setActiveSection: (section: string | null) => void;
};

const getStatus = (
  key: SectionKey,
  roadmapStatus: CheckFileRes | null,
  scoringStatus: CheckFileRes | null,
  workoutStatus: CheckFileRes | null,
): CheckFileRes | null => {
  if (key === "roadmap") return roadmapStatus;
  if (key === "scoring") return scoringStatus;
  return workoutStatus;
};

const Stats = ({
  roadmapStatus,
  scoringStatus,
  workoutStatus,
  checkingSection,
  activeSection,
  uploadingSection,
  onCheck,
  onUpload,
  onDownload,
  setActiveSection,
}: Props) => {
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [fileErrors, setFileErrors] = useState<Record<string, string>>({});

  const handleCardClick = (key: SectionKey) => {
    if (activeSection === key) {
      setActiveSection(null);
      return;
    }
    setFileErrors((prev) => ({ ...prev, [key]: "" }));
    onCheck(key);
  };

  const handleFileChange = (
    key: SectionKey,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      setFileErrors((prev) => ({ ...prev, [key]: error }));
      e.target.value = "";
      return;
    }

    setFileErrors((prev) => ({ ...prev, [key]: "" }));
    onUpload(key, file);
    e.target.value = "";
  };

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {SECTIONS.map(({ key, label, description }) => {
        const status = getStatus(
          key,
          roadmapStatus,
          scoringStatus,
          workoutStatus,
        );
        const isActive = activeSection === key;
        const isChecking = checkingSection === key;
        const isUploading = uploadingSection === key;
        const hasFile = status?.hasActiveDocument;

        return (
          <div
            key={key}
            className={`bg-white rounded-xl border-2 transition-all duration-200 overflow-hidden ${
              isActive
                ? "border-orange-400 shadow-md"
                : "border-orange-200 hover:border-orange-300 hover:shadow-sm"
            }`}
          >
            {/* Header - clickable */}
            <button
              className="w-full p-4 text-left flex items-start justify-between gap-2"
              onClick={() => handleCardClick(key)}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg ${hasFile ? "bg-green-100" : "bg-orange-50"}`}
                >
                  <FileText
                    size={18}
                    className={hasFile ? "text-green-600" : "text-orange-400"}
                  />
                </div>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">
                    {label}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {description}
                  </div>
                  {status !== null && (
                    <div
                      className={`inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                        hasFile
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${hasFile ? "bg-green-500" : "bg-gray-400"}`}
                      />
                      {hasFile ? "Đang dùng" : "Chưa có file"}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-1 text-gray-400 flex-shrink-0">
                {isChecking ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : isActive ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </div>
            </button>

            {/* Expanded actions */}
            {isActive && status !== null && (
              <div className="px-4 pb-4 border-t border-orange-100 pt-3 space-y-3">
                <div className="flex gap-2">
                  {/* Upload */}
                  <button
                    onClick={() => fileInputRefs.current[key]?.click()}
                    disabled={isUploading}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 text-xs font-medium transition disabled:opacity-50"
                  >
                    {isUploading ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Upload size={13} />
                    )}
                    {hasFile ? "Cập nhật file" : "Tải lên"}
                  </button>
                  <input
                    ref={(el) => {
                      fileInputRefs.current[key] = el;
                    }}
                    type="file"
                    accept=".md,.txt,.pdf"
                    className="hidden"
                    onChange={(e) => handleFileChange(key, e)}
                  />

                  {/* Download - only when has file */}
                  {hasFile && (
                    <button
                      onClick={() => onDownload(key)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-medium transition"
                    >
                      <Download size={13} />
                      Tải xuống
                    </button>
                  )}
                </div>

                {/* Validation error */}
                {fileErrors[key] && (
                  <div className="flex items-start gap-1.5 text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
                    <AlertCircle size={13} className="mt-0.5 shrink-0" />
                    <span>{fileErrors[key]}</span>
                  </div>
                )}

                {/* Info note */}
                <div className="text-xs text-gray-400 space-y-0.5">
                  <div>
                    <span className="font-medium text-gray-500">
                      Định dạng:
                    </span>{" "}
                    Markdown (.md), Text (.txt), PDF (.pdf)
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Tối đa:</span>{" "}
                    10MB — File hết hạn sau 48 giờ
                  </div>
                  {hasFile && (
                    <div className="text-amber-500">
                      ⚠ File hiện tại sẽ bị xoá trước khi tải lên file mới.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Stats;
