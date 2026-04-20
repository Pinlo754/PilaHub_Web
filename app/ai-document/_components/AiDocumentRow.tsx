import { AiDocumentType } from "@/utils/AiDocumentType";
import { formatLocalDateTime } from "@/utils/day";
import { Download, Trash2 } from "lucide-react";

type Props = {
  document: AiDocumentType;
  onPressDocument: (doc: AiDocumentType) => void;
  onDelete: (fileName: string) => void;
  onDownload: (fileName: string) => void;
};

const STATE_MAP: Record<
  string,
  { label: string; bgColor: string; textColor: string }
> = {
  ACTIVE: {
    label: "Hoạt động",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
  },
  PROCESSING: {
    label: "Đang xử lý",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-700",
  },
  FAILED: { label: "Lỗi", bgColor: "bg-red-100", textColor: "text-red-700" },
};

const formatBytes = (bytes: string) => {
  const num = parseInt(bytes, 10);
  if (isNaN(num)) return bytes;
  if (num < 1024) return `${num} B`;
  if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
  return `${(num / (1024 * 1024)).toFixed(1)} MB`;
};

const AiDocumentRow = ({
  document,
  onPressDocument,
  onDelete,
  onDownload,
}: Props) => {
  const stateConfig = STATE_MAP[document.state] ?? {
    label: document.state,
    bgColor: "bg-gray-100",
    textColor: "text-gray-600",
  };

  const fileName = document.name.split("/").pop() ?? document.name;

  return (
    <tr
      onClick={() => onPressDocument(document)}
      className="border-b border-orange-100 hover:bg-orange-50 cursor-pointer"
    >
      <td className="py-3 px-4 text-gray-800 font-medium max-w-[180px] truncate">
        {document.displayName || fileName}
      </td>
      <td className="py-3 px-4 text-gray-500 text-sm">{document.mimeType}</td>
      <td className="py-3 px-4 text-gray-600 text-center text-sm">
        {formatBytes(document.sizeBytes)}
      </td>
      <td className="py-3 px-4 text-center">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${stateConfig.bgColor} ${stateConfig.textColor}`}
        >
          {stateConfig.label}
        </span>
      </td>
      <td className="py-3 px-4 text-gray-500 text-center text-sm">
        {formatLocalDateTime(document.createTime)}
      </td>
      <td className="py-3 px-4 text-gray-500 text-center text-sm">
        {formatLocalDateTime(document.expirationTime)}
      </td>
      <td className="py-3 px-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownload(fileName);
            }}
            title="Tải xuống"
            className="p-2 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
          >
            <Download size={15} />
          </button>
          {/* <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(fileName);
            }}
            title="Xoá"
            className="p-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition"
          >
            <Trash2 size={15} />
          </button> */}
        </div>
      </td>
    </tr>
  );
};

export default AiDocumentRow;
