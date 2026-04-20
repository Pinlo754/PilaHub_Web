import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductType } from "@/utils/ProductType";
import { PageResponse } from "@/utils/ApiResType";
import { getActiveConfig } from "@/utils/uiMapper";

type Props = {
  productPage?: PageResponse<ProductType>;
  currentPage: number;
  onPageChange: (page: number) => void;
};

const ProductTable = ({ productPage, currentPage, onPageChange }: Props) => {
  const products = productPage?.content ?? [];
  const totalPages = productPage?.totalPages ?? 1;

  return (
    <div className="bg-white rounded-2xl border-2 border-orange-200 p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-orange-700">
          Danh sách sản phẩm
        </h3>
        <span className="text-xs text-gray-400">
          {productPage?.totalElements ?? 0} sản phẩm
        </span>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-orange-100">
            <th className="text-left py-3 px-4 font-semibold text-orange-700">
              Mã
            </th>
            <th className="text-left py-3 px-4 font-semibold text-orange-700">
              Sản phẩm
            </th>
            <th className="text-left py-3 px-4 font-semibold text-orange-700">
              Số lượng
            </th>
            <th className="text-left py-3 px-4 font-semibold text-orange-700">
              Trạng thái
            </th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="py-6 text-center text-gray-400 text-sm"
              >
                Không có sản phẩm
              </td>
            </tr>
          ) : (
            products.map((product) => {
              const activeConfig = getActiveConfig(product.active);
              return (
                <tr
                  key={product.productId}
                  className="border-b border-orange-100 hover:bg-orange-50"
                >
                  <td className="py-3 px-4 text-gray-700 text-sm font-mono">
                    {product.productId.slice(0, 8)}...
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-8 h-8 rounded object-cover flex-shrink-0"
                      />
                      <span className="text-gray-700 text-sm line-clamp-1">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-700 text-sm">
                    {product.stockQuantity}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${activeConfig.bgColor} ${activeConfig.textColor}`}
                    >
                      {activeConfig.label}
                    </span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      <div className="mt-6 flex items-center justify-center gap-2">
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
