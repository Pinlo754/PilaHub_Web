import { formatLocalDateTime } from "@/utils/day";
import { getVerifyConfig } from "@/utils/uiMapper";
import { VendorType } from "@/utils/VendorType";
import {
  BadgePercent,
  CalendarDays,
  ExternalLink,
  FileCheck,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import Image from "next/image";

type Props = {
  vendor: VendorType | undefined;
};

const VendorDetail = ({ vendor }: Props) => {
  // VARIABLE
  const config = getVerifyConfig(vendor?.verified ?? false);

  return (
    <div className="bg-white rounded-2xl border-2 border-orange-200 p-6">
      <h3 className="text-lg font-semibold text-orange-700 mb-3">
        Thông tin nhà cung cấp
      </h3>
      {vendor && (
        // <div className="grid grid-cols-3">
        //   <div className="flex justify-center items-center">
        //     <div className="w-[90px] h-[90px] rounded-full overflow-hidden border">
        //       <Image
        //         src={vendor.logoUrl}
        //         alt="logo"
        //         width={60}
        //         height={60}
        //         className="object-cover w-full h-full"
        //       />
        //     </div>
        //   </div>
        //   <div className="space-y-3 text-sm col-span-2">
        //     <div>
        //       <p className="text-gray-600">
        //         Tên:{" "}
        //         <span className="text-orange-700 font-semibold">
        //           {vendor.businessName}
        //         </span>
        //       </p>
        //     </div>
        //     <div>
        //       <p className="text-gray-600">
        //         Ngày đăng ký: {formatLocalDateTime(vendor.createdAt)}
        //       </p>
        //     </div>
        //     <div>
        //       <p className="text-gray-600">Email: abc@gmail.com</p>
        //     </div>
        //     <div>
        //       <p className="text-gray-600">
        //         Số điện thoại: {vendor.phoneNumber}
        //       </p>
        //     </div>
        //   </div>
        // </div>
        <div className="space-y-4">
          {/* Avatar + name + badge */}
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-orange-100 shrink-0">
              <Image
                src={vendor.logoUrl}
                alt="logo"
                width={56}
                height={56}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <p className="font-semibold text-gray-800 leading-snug">
                {vendor.businessName}
              </p>
              <span
                className={`mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}
              >
                {config.label}
              </span>
            </div>
          </div>
          {/* Info rows */}
          <div className="space-y-2 text-sm">
            <InfoRow icon={<Mail size={14} />} label="abc@gmail.com" />
            <InfoRow icon={<Phone size={14} />} label={vendor.phoneNumber} />
            <InfoRow
              icon={<MapPin size={14} />}
              label={`${vendor.city}, ${vendor.country}`}
            />
            <InfoRow
              icon={<CalendarDays size={14} />}
              label={formatLocalDateTime(vendor.createdAt, "date")}
            />
            <InfoRow
              icon={<BadgePercent size={14} />}
              label={`Phí nền tảng: ${vendor.platformFeePercentage}%`}
            />
            <a
              href={vendor.businessLicenseUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 p-2.5 rounded-xl bg-orange-50 border border-orange-200 hover:bg-orange-100 transition-colors group"
            >
              <FileCheck size={15} className="text-orange-500 shrink-0" />
              <span className="text-sm text-orange-700 font-medium flex-1">
                Giấy phép kinh doanh
              </span>
              <ExternalLink
                size={13}
                className="text-orange-400 group-hover:text-orange-600 transition-colors"
              />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoRow = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex items-center gap-2 text-gray-600">
    <span className="text-orange-400 shrink-0">{icon}</span>
    <span className="truncate">{label}</span>
  </div>
);

export default VendorDetail;
