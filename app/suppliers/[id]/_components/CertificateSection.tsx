import { AlertCircle } from "lucide-react";

const CertificateSection = () => {
  return (
    <div className="bg-white rounded-2xl border-2 border-orange-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle size={20} className="text-orange-700" />
        <h3 className="text-lg font-semibold text-orange-700">
          Chứng chỉ, chứng nhận
        </h3>
      </div>
      <p className="text-xs text-gray-600 mb-3">
        Giấy phép kinh doanh: Đang hoạt động
      </p>
      <p className="text-xs text-red-500 mb-4">
        Chứng chỉ sản phẩm: 19/30 (1 sản phẩm cần cập nhật chứng chỉ)
      </p>
      <button className="w-full px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm font-medium">
        Xem chi tiết →
      </button>
    </div>
  );
};

export default CertificateSection;
