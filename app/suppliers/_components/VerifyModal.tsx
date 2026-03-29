"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { VendorType } from "@/utils/VendorType";
import { formatLocalDateTime } from "@/utils/day";
import {
  CheckCircle,
  XCircle,
  Building2,
  Phone,
  MapPin,
  FileText,
  Calendar,
  Clock,
} from "lucide-react";
import Image from "next/image";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendor: VendorType | null;
  onVerify: () => void;
};

const VerifyModal = ({ open, onOpenChange, vendor, onVerify }: Props) => {
  if (!vendor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-orange-700">
            Xác minh nhà cung cấp
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Kiểm tra thông tin và xác nhận nhà cung cấp này
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Vendor Logo & Name */}
          <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl">
            <div className="w-16 h-16 relative rounded-full border-2 border-orange-200 overflow-hidden bg-white">
              <Image
                src={vendor.logoUrl || "/default-logo.png"}
                alt={vendor.businessName}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">
                {vendor.businessName}
              </h3>
              <p className="text-sm text-gray-500 font-mono">
                {vendor.vendorId.slice(0, 8)}...
              </p>
            </div>
          </div>

          {/* Vendor Details */}
          <FieldGroup>
            {/* Phone */}
            <Field>
              <Label className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                Số điện thoại
              </Label>
              <div className="px-3 py-2 rounded-md bg-gray-50 text-gray-800">
                {vendor.phoneNumber}
              </div>
            </Field>

            {/* Address */}
            <Field>
              <Label className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                Địa chỉ
              </Label>
              <div className="px-3 py-2 rounded-md bg-gray-50 text-gray-800">
                {vendor.address}, {vendor.city}, {vendor.country}
              </div>
            </Field>

            {/* Business License */}
            <Field>
              <Label className="flex items-center gap-2 text-gray-600">
                <FileText className="w-4 h-4" />
                Giấy phép kinh doanh
              </Label>
              <a
                href={vendor.businessLicenseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors inline-flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Xem giấy phép
              </a>
            </Field>

            {/* Holding Days */}
            <Field>
              <Label className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                Số ngày giữ tiền
              </Label>
              <div className="px-3 py-2 rounded-md bg-gray-50 text-gray-800">
                {vendor.holdingDays} ngày
              </div>
            </Field>
          </FieldGroup>

          {/* Info Section */}
          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Ngày đăng ký
              </span>
              <span className="text-gray-700">
                {formatLocalDateTime(vendor.createdAt)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Trạng thái
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">
                Chưa xác thực
              </span>
            </div>
          </div>

          {/* Warning */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-sm text-yellow-800">
              <strong>Lưu ý:</strong> Sau khi xác minh, nhà cung cấp sẽ có thể
              bắt đầu bán hàng trên nền tảng. Hãy đảm bảo bạn đã kiểm tra kỹ
              thông tin và giấy phép kinh doanh.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-200"
          >
            Huỷ
          </Button>
          <Button
            onClick={onVerify}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Xác minh
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VerifyModal;
