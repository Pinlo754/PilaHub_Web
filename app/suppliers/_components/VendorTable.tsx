import { VendorType } from "@/utils/VendorType";
import VendorRow from "./VendorRow";

type Props = {
  vendors: VendorType[];
  startIndex: number;
  onPressVendor: (vendor: VendorType) => void;
};

const VendorTable = ({ vendors, onPressVendor, startIndex }: Props) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b-2 border-orange-100">
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            STT
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Logo
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Tên nhà cung cấp
          </th>

          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Số điện thoại
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Địa chỉ
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Thành phố
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Ngày đăng ký
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Trạng thái
          </th>
        </tr>
      </thead>
      <tbody>
        {vendors.length === 0 ? (
          <tr>
            <td colSpan={8} className="text-center py-10 text-gray-400">
              Không có dữ liệu
            </td>
          </tr>
        ) : (
          vendors.map((vendor, idx) => (
            <VendorRow
              key={vendor.vendorId}
              vendor={vendor}
              index={startIndex + idx + 1}
              onPressVendor={onPressVendor}
            />
          ))
        )}
      </tbody>
    </table>
  );
};

export default VendorTable;
