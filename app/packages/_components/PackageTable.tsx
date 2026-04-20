import { PackageType } from "@/utils/PackageType";
import PackageRow from "./PackageRow";

type Props = {
  packages: PackageType[];
  onPressPackage: (pkg: PackageType) => void;
  updateStatusPackage: (packageId: string, isActive: boolean) => void;
};

const PackageTable = ({
  packages,
  onPressPackage,
  updateStatusPackage,
}: Props) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b-2 border-orange-100">
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Mã gói
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Tên gói
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Loại
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Giá (VNĐ)
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Thời hạn (ngày)
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Trạng thái
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Hành động
          </th>
        </tr>
      </thead>
      <tbody>
        {packages.map((pkg) => (
          <PackageRow
            key={pkg.packageId}
            pkg={pkg}
            onPressPackage={onPressPackage}
            updateStatusPackage={updateStatusPackage}
          />
        ))}
      </tbody>
    </table>
  );
};

export default PackageTable;
