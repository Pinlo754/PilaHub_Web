import { useState } from "react";
import {
  BookOpen, Wind, CheckCircle, AlertTriangle,
  Video, LoaderCircle, Upload,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFirebaseUpload } from "@/hooks/useFirebaseUpload";
import Pagination from "../../_components/Pagination";
import { TutorialType, UpdateTutorialReq } from "@/utils/TutorialType";

type Props = {
  tutorial: TutorialType | null;
  draft: Partial<UpdateTutorialReq>;
  onDraftChange: (patch: Partial<UpdateTutorialReq>) => void;
  isLoading: boolean;
};

const getEmbedUrl = (rawUrl: string): string | null => {
  try {
    const u = new URL(rawUrl);
    if (u.hostname.includes("youtube.com") && u.searchParams.get("v"))
      return `https://www.youtube.com/embed/${u.searchParams.get("v")}`;
    if (u.hostname === "youtu.be")
      return `https://www.youtube.com/embed${u.pathname}`;
    if (u.hostname.includes("vimeo.com"))
      return `https://player.vimeo.com/video/${u.pathname.replace("/", "")}`;
    if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(u.pathname)) return rawUrl;
    return null;
  } catch { return null; }
};

const VideoBlock = ({
  label, url, onChange,
}: { label: string; url: string; onChange: (url: string) => void }) => {
  const embedUrl = url ? getEmbedUrl(url) : null;
  const isDirect = embedUrl === url;
  const { uploadFile, loading } = useFirebaseUpload();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const uploaded = await uploadFile(file, "tutorials");
    onChange(uploaded);
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 overflow-hidden flex flex-col h-full">
      <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 shrink-0">
        <Video size={12} />{label}
      </div>

      {/* Video preview */}
      <div className="flex-1 min-h-0 relative">
        {embedUrl ? (
          isDirect
            ? <video src={embedUrl} controls className="w-full h-full object-contain bg-black" />
            : <iframe src={embedUrl} allowFullScreen className="w-full h-full" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-gray-300">
            <span>Chưa có video</span>
          </div>
        )}
      </div>

      {/* URL input */}
      <div className="px-3 pb-2 pt-1.5 space-y-1 shrink-0 border-t border-gray-100">
        <Input className="text-xs h-7" placeholder="Nhập URL YouTube / Vimeo / MP4..."
          value={url} onChange={(e) => onChange(e.target.value)} />
        <label className="flex items-center gap-1 text-xs text-orange-600 cursor-pointer w-fit">
          <Upload size={11} /><span>Upload file video</span>
          <input type="file" accept="video/*" className="hidden" disabled={loading} onChange={handleUpload} />
        </label>
      </div>
    </div>
  );
};

const COLOR_MAP = {
  green: { bg: "bg-green-50", border: "border-green-100", label: "text-green-700", text: "text-green-800" },
  red:   { bg: "bg-red-50",   border: "border-red-100",   label: "text-red-700",   text: "text-red-800" },
  blue:  { bg: "bg-blue-50",  border: "border-blue-100",  label: "text-blue-700",  text: "text-blue-800" },
} as const;
type ColorKey = keyof typeof COLOR_MAP;

// 2 pages: page 1 = videos, page 2-4 = text sections
const TEXT_SECTIONS: {
  icon: React.ReactNode;
  label: string;
  field: keyof UpdateTutorialReq;
  color: ColorKey;
}[] = [
  { icon: <CheckCircle size={13} className="text-green-500" />, label: "Hướng dẫn thực hiện", field: "guidelines",          color: "green" },
  { icon: <AlertTriangle size={13} className="text-red-500" />, label: "Lỗi thường gặp",       field: "commonMistakes",     color: "red"   },
  { icon: <Wind size={13} className="text-blue-500" />,          label: "Kỹ thuật thở",          field: "breathingTechnique", color: "blue"  },
];

// Total pages: 1 (videos) + 3 (text sections) = 4
const TOTAL_PAGES = 1 + TEXT_SECTIONS.length;

const TutorialSection = ({ tutorial, draft, onDraftChange, isLoading }: Props) => {
  const [page, setPage] = useState(1);

  const isVideoPage = page === 1;
  const textSection = isVideoPage ? null : TEXT_SECTIONS[page - 2];

  return (
    <div className="bg-white rounded-2xl border-2 border-orange-200 p-5 flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <h2 className="text-sm font-bold text-orange-500">Hướng dẫn</h2>
        {tutorial && (
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer text-xs">
              <input type="checkbox" className="w-3.5 h-3.5"
                checked={draft.published ?? tutorial.published}
                onChange={(e) => onDraftChange({ published: e.target.checked })} />
              Xuất bản
            </label>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
              (draft.published ?? tutorial.published) ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
            }`}>
              {(draft.published ?? tutorial.published) ? "Đã xuất bản" : "Bản nháp"}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <LoaderCircle size={24} className="animate-spin text-orange-400" />
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-hidden">
          {/* Page 1: Videos */}
          {isVideoPage && (
            <div className="grid grid-cols-2 gap-3 h-full">
              <VideoBlock
                label="Video lý thuyết"
                url={draft.theoryVideoUrl ?? tutorial?.theoryVideoUrl ?? ""}
                onChange={(url) => onDraftChange({ theoryVideoUrl: url })}
              />
              <VideoBlock
                label="Video thực hành"
                url={draft.practiceVideoUrl ?? tutorial?.practiceVideoUrl ?? ""}
                onChange={(url) => onDraftChange({ practiceVideoUrl: url })}
              />
            </div>
          )}

          {/* Page 2-4: Text sections */}
          {textSection && (() => {
            const c = COLOR_MAP[textSection.color];
            return (
              <div className={`rounded-xl p-4 border h-full flex flex-col ${c.bg} ${c.border}`}>
                <div className={`flex items-center gap-1.5 text-xs font-semibold mb-3 shrink-0 ${c.label}`}>
                  {textSection.icon}{textSection.label}
                </div>
                <Textarea
                  className={`resize-none text-sm border-0 bg-transparent focus-visible:ring-0 p-0 flex-1 ${c.text}`}
                  value={(draft[textSection.field] as string) ?? (tutorial?.[textSection.field] as string) ?? ""}
                  onChange={(e) => onDraftChange({ [textSection.field]: e.target.value })}
                  placeholder={`Nhập ${textSection.label.toLowerCase()}...`}
                />
              </div>
            );
          })()}
        </div>
      )}

      {/* Pagination inside box */}
      <div className="shrink-0 pt-3 border-t mt-3">
        <Pagination currentPage={page} totalPages={TOTAL_PAGES} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default TutorialSection;