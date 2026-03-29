import { formatLocalDateTime } from "@/utils/day";
import { getVerifyConfig } from "@/utils/uiMapper";
import { VendorType } from "@/utils/VendorType";
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
        <div className="grid grid-cols-3">
          <div className="flex justify-center items-center">
            <div className="w-[90px] h-[90px] rounded-full overflow-hidden border">
              <Image
                src={vendor.logoUrl}
                alt="logo"
                width={60}
                height={60}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
          <div className="space-y-3 text-sm col-span-2">
            <div>
              <p className="text-gray-600">
                Tên:{" "}
                <span className="text-orange-700 font-semibold">
                  {vendor.businessName}
                </span>
              </p>
            </div>
            <div>
              <p className="text-gray-600">
                Ngày đăng ký: {formatLocalDateTime(vendor.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Email: abc@gmail.com</p>
            </div>
            <div>
              <p className="text-gray-600">
                Số điện thoại: {vendor.phoneNumber}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDetail;
