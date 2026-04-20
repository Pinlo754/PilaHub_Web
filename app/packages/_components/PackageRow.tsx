import { PackageType } from "@/utils/PackageType";
import { getPackageConfig } from "@/utils/uiMapper";
import { Power, PowerOff } from "lucide-react";

type Props = {
  pkg: PackageType;
  onPressPackage: (pkg: PackageType) => void;
  updateStatusPackage: (packageId: string, isActive: boolean) => void;
};

const PackageRow = ({ pkg, onPressPackage, updateStatusPackage }: Props) => {
  const shortId = `${pkg.packageId.slice(0, 6)}...`;
  const packageConfig = getPackageConfig(pkg.packageType);

  return (
    <tr
      onClick={() => onPressPackage(pkg)}
      className="border-b border-orange-100 hover:bg-orange-50 cursor-pointer"
    >
      <td className="py-3 px-4 text-gray-500">{shortId}</td>
      <td className="py-3 px-4 text-gray-700 font-medium">{pkg.packageName}</td>
      <td className="py-3 px-4 text-center">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${packageConfig.bgColor} ${packageConfig.textColor}`}
        >
          {packageConfig.label}
        </span>
      </td>
      <td className="py-3 px-4 text-gray-700 text-center">
        {pkg.price.toLocaleString("vi-VN")}
      </td>
      <td className="py-3 px-4 text-gray-700 text-center">
        {pkg.durationInDays}
      </td>
      <td className="py-3 px-4 text-center">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            pkg.isActive
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {pkg.isActive ? "Đang hoạt động" : "Tạm dừng"}
        </span>
      </td>
      <td className="py-3 px-4 text-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            updateStatusPackage(pkg.packageId, pkg.isActive);
          }}
          className={`p-2 rounded-md transition inline-flex items-center justify-center ${
            pkg.isActive
              ? "bg-red-100 text-red-600 hover:bg-red-200"
              : "bg-green-100 text-green-600 hover:bg-green-200"
          }`}
        >
          {pkg.isActive ? <PowerOff size={16} /> : <Power size={16} />}
        </button>
      </td>
    </tr>
  );
};

export default PackageRow;
