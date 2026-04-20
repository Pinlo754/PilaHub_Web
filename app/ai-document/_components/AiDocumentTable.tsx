// AiDocumentTable.tsx
import { AiDocumentType } from "@/utils/AiDocumentType";
import AiDocumentRow from "./AiDocumentRow";

type Props = {
  documents: AiDocumentType[];
  onPressDocument: (doc: AiDocumentType) => void;
  onDelete: (fileName: string) => void;
  onDownload: (fileName: string) => void;
};

const AiDocumentTable = ({
  documents,
  onPressDocument,
  onDelete,
  onDownload,
}: Props) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b-2 border-orange-100">
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Tên hiển thị
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Loại MIME
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Kích thước
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Trạng thái
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Ngày tạo
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Hết hạn
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Hành động
          </th>
        </tr>
      </thead>
      <tbody>
        {documents.length === 0 ? (
          <tr>
            <td colSpan={7} className="py-10 text-center text-gray-400 text-sm">
              Không có tài liệu nào
            </td>
          </tr>
        ) : (
          documents.map((doc) => (
            <AiDocumentRow
              key={doc.name}
              document={doc}
              onPressDocument={onPressDocument}
              onDelete={onDelete}
              onDownload={onDownload}
            />
          ))
        )}
      </tbody>
    </table>
  );
};

export default AiDocumentTable;
