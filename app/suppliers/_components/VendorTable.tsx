import { VendorType } from "@/utils/VendorType";
import VendorRow from "./VendorRow";

type Props = {
  vendors: VendorType[];
  onPressVendor: (vendor: VendorType) => void;
};

const VendorTable = ({ vendors, onPressVendor }: Props) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b-2 border-orange-100">
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Mã nhà cung cấp
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Logo
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Tên nhà cung cấp
          </th>

          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Số điện thoại
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Địa chỉ
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Thành phố
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Ngày đăng ký
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Trạng thái
          </th>
        </tr>
      </thead>
      <tbody>
        {vendors.map((vendor) => (
          <VendorRow
            key={vendor.vendorId}
            vendor={vendor}
            onPressVendor={onPressVendor}
          />
        ))}
      </tbody>
    </table>
  );
};

export default VendorTable;
