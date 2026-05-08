"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProductType } from "@/utils/ProductType";
import { getActiveConfig } from "@/utils/uiMapper";
import { formatLocalDateTime } from "@/utils/day";
import { AlertTriangle, CheckCircle } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductType | null;
  onUpdateRuleViolation: (productId: string, currentViolation: boolean) => void;
};

const ProductDetailModal = ({
  open,
  onOpenChange,
  product,
  onUpdateRuleViolation,
}: Props) => {
  if (!product) return null;

  const activeConfig = getActiveConfig(product.active);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-orange-700">
            Chi tiết sản phẩm
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image + Name */}
          <div className="flex items-center gap-4">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-16 h-16 rounded-xl object-cover border border-orange-100"
            />
            <div>
              <p className="font-semibold text-gray-800">{product.name}</p>
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                {product.productId}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${activeConfig.bgColor} ${activeConfig.textColor}`}
                >
                  {activeConfig.label}
                </span>
                {product.ruleViolation && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                    Vi phạm quy tắc
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-2 text-sm border-t pt-4">
            <div>
              <p className="text-gray-400 text-xs">Thương hiệu</p>
              <p className="text-gray-700 font-medium">
                {product.brand || "—"}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Danh mục</p>
              <p className="text-gray-700 font-medium">
                {product.categoryName}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Giá</p>
              <p className="text-orange-600 font-semibold">
                {product.price.toLocaleString("vi-VN")}₫
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Tồn kho</p>
              <p className="text-gray-700 font-medium">
                {product.stockQuantity}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Đánh giá</p>
              <p className="text-gray-700 font-medium">
                {product.avgRating != null ? `${product.avgRating} ⭐` : "—"} (
                {product.reviewCount})
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Hỗ trợ lắp đặt</p>
              <p className="text-gray-700 font-medium">
                {product.installationSupported ? "Có" : "Không"}
              </p>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="text-sm border-t pt-4">
              <p className="text-gray-400 text-xs mb-1">Mô tả</p>
              <p className="text-gray-700 line-clamp-3">
                {product.description}
              </p>
            </div>
          )}

          {/* Timestamps */}
          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Ngày tạo</span>
              <span>{formatLocalDateTime(product.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Cập nhật lần cuối</span>
              <span>{formatLocalDateTime(product.updatedAt)}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          <Button
            variant="outline"
            className={
              product.ruleViolation
                ? "bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                : "bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
            }
            onClick={() =>
              onUpdateRuleViolation(product.productId, product.ruleViolation)
            }
          >
            {product.ruleViolation ? (
              <>
                <CheckCircle size={15} className="mr-1.5" />
                Gỡ vi phạm
              </>
            ) : (
              <>
                <AlertTriangle size={15} className="mr-1.5" />
                Đánh dấu vi phạm
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
