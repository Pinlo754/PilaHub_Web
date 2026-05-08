import {
  ChevronLeft,
  ChevronRight,
  Search,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { ProductType } from "@/utils/ProductType";
import { PageResponse } from "@/utils/ApiResType";
import { getActiveConfig } from "@/utils/uiMapper";

type Props = {
  productPage?: PageResponse<ProductType>;
  currentPage: number;
  onPageChange: (page: number) => void;
  searchTerm: string;
  onSearch: (name: string) => void;
  onRowClick: (product: ProductType) => void;
  onUpdateRuleViolation: (productId: string, currentViolation: boolean) => void;
};

const ProductTable = ({
  productPage,
  currentPage,
  onPageChange,
  onSearch,
  searchTerm,
  onRowClick,
  onUpdateRuleViolation,
}: Props) => {
  const products = productPage?.content ?? [];
  const totalPages = productPage?.totalPages ?? 1;

  return (
    <div className="bg-white rounded-2xl border-2 border-orange-200 px-5 py-6 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-orange-700">
          Danh sách sản phẩm
        </h3>
        <span className="text-xs text-gray-400">
          {productPage?.totalElements ?? 0} sản phẩm
        </span>
      </div>

      {/* Search */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-2 border-orange-100 rounded-lg focus:outline-none focus:border-orange-300"
          />
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-orange-100">
            <th className="text-center py-3 px-4 font-semibold text-orange-700">
              STT
            </th>
            <th className="text-left py-3 px-4 font-semibold text-orange-700">
              Sản phẩm
            </th>
            <th className="text-center py-3 px-4 font-semibold text-orange-700">
              Số lượng
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
          {products.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="py-6 text-center text-gray-400 text-sm"
              >
                Không có sản phẩm
              </td>
            </tr>
          ) : (
            products.map((product, index) => {
              const activeConfig = getActiveConfig(product.active);
              return (
                <tr
                  key={product.productId}
                  className="border-b border-orange-100 hover:bg-orange-50"
                  onClick={() => onRowClick(product)}
                >
                  <td className="py-3 px-4 text-gray-700 text-center">
                    {index + 1}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-8 h-8 rounded object-cover flex-shrink-0"
                      />
                      <span className="text-gray-700line-clamp-1">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-700 text-center">
                    {product.stockQuantity}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full font-medium ${activeConfig.bgColor} ${activeConfig.textColor}`}
                    >
                      {activeConfig.label}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateRuleViolation(
                          product.productId,
                          product.ruleViolation,
                        );
                      }}
                      title={
                        product.ruleViolation
                          ? "Gỡ vi phạm"
                          : "Đánh dấu vi phạm"
                      }
                      className={`p-1.5 rounded-lg transition-colors inline-flex items-center justify-center ${
                        !product.ruleViolation
                          ? "bg-red-100 text-red-600 hover:bg-red-200"
                          : "bg-green-100 text-green-600 hover:bg-green-200"
                      }`}
                    >
                      {!product.ruleViolation ? (
                        <ShieldAlert size={18} />
                      ) : (
                        <ShieldCheck size={18} />
                      )}
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      <div className="mt-8 flex items-center justify-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="p-1 hover:bg-orange-100 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={20} className="text-orange-600" />
        </button>
        <span className="text-gray-600 text-sm">
          {currentPage + 1} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage + 1 >= totalPages}
          className="p-1 hover:bg-orange-100 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={20} className="text-orange-600" />
        </button>
      </div>
    </div>
  );
};

export default ProductTable;
