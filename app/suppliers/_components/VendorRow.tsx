import { formatLocalDateTime } from "@/utils/day";
import { getVerifyConfig } from "@/utils/uiMapper";
import { VendorType } from "@/utils/VendorType";

type Props = {
  vendor: VendorType;
  onPressVendor: (vendor: VendorType) => void;
};

const VendorRow = ({ vendor, onPressVendor }: Props) => {
  const config = getVerifyConfig(vendor.verified);
  const shortId = `${vendor.vendorId.slice(0, 6)}...`;

  return (
    <tr
      onClick={() => onPressVendor(vendor)}
      className="border-b border-orange-100 hover:bg-orange-50 cursor-pointer"
    >
      <td className="py-3 px-4 text-gray-500">{shortId}</td>
      <td className="py-3 px-4">
        <img
          src={vendor.logoUrl || "/default-logo.png"}
          alt={vendor.businessName}
          className="w-10 h-10 object-cover rounded-full border"
        />
      </td>
      <td className="py-3 px-4 text-gray-700">{vendor.businessName}</td>

      <td className="py-3 px-4 text-gray-700">{vendor.phoneNumber}</td>
      <td className="py-3 px-4 text-gray-700">{vendor.address}</td>
      <td className="py-3 px-4 text-gray-700">{vendor.city}</td>
      <td className="py-3 px-4 text-gray-700">
        {formatLocalDateTime(vendor.createdAt)}
      </td>
      <td className="py-3 px-4">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.textColor}`}
        >
          {config.label}
        </span>
      </td>
    </tr>
  );
};

export default VendorRow;
