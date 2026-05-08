import { useCallback, useEffect, useState } from "react";
import { VendorService } from "@/hooks/vendor.service";
import { VendorType } from "@/utils/VendorType";
import { OrderType } from "@/utils/OrderType";
import { ProductType } from "@/utils/ProductType";
import { PageResponse } from "@/utils/ApiResType";
import { OrderService } from "@/hooks/order.service";
import { ProductService } from "@/hooks/product.service";
import { useToast } from "@/hooks/useToast";
import { useConfirm } from "@/hooks/useConfirm";

type Props = {
  vendorId: string;
};

const PRODUCT_PAGE_SIZE = 10;
const RECENT_ORDER_LIMIT = 12;
const ORDER_PAGE_SIZE = 3;

export const useSupplierDetail = ({ vendorId }: Props) => {
  // STATE
  const [vendor, setVendor] = useState<VendorType>();
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [productPage, setProductPage] = useState<PageResponse<ProductType>>();
  const [currentProductPage, setCurrentProductPage] = useState(0);
  const [currentOrderPage, setCurrentOrderPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [productSearchTerm, setProductSearchTerm] = useState("");

  // ─── MODAL STATE ──────────────────────────────────────────
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null,
  );
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  // ─── TOAST & CONFIRM ─────────────────────────────────────
  const { toasts, removeToast, showSuccess, showError } = useToast();
  const { confirmState, isConfirmOpen, confirm, closeConfirm } = useConfirm();

  // API
  const fetchById = async () => {
    setIsLoading(true);
    try {
      const [vendorRes, orderRes, productRes] = await Promise.all([
        VendorService.getById(vendorId),
        OrderService.getByVendorId(vendorId),
        ProductService.getByVendorId(vendorId, 0, PRODUCT_PAGE_SIZE),
      ]);

      setVendor(vendorRes);
      setOrders(orderRes);
      setProductPage(productRes);
    } catch (err: any) {
      if (err?.type === "BUSINESS_ERROR") {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Có lỗi xảy ra");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = useCallback(
    async (page: number, name?: string) => {
      setIsLoading(true);
      try {
        const res = await ProductService.getByVendorId(
          vendorId,
          page,
          PRODUCT_PAGE_SIZE,
          name,
        );
        setProductPage(res);
      } catch (err: any) {
        setErrorMsg(
          err?.type === "BUSINESS_ERROR" ? err.message : "Có lỗi xảy ra",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [vendorId],
  );

  // ─── PRODUCT MODAL ────────────────────────────────────────
  const handleOpenProductModal = useCallback((product: ProductType) => {
    setSelectedProduct(product);
    setProductModalOpen(true);
  }, []);

  const handleCloseProductModal = useCallback((open: boolean) => {
    setProductModalOpen(open);
  }, []);

  // ─── ORDER MODAL ──────────────────────────────────────────
  const handleOpenOrderModal = useCallback((order: OrderType) => {
    setSelectedOrder(order);
    setOrderModalOpen(true);
  }, []);

  const handleCloseOrderModal = useCallback((open: boolean) => {
    setOrderModalOpen(open);
  }, []);

  // ─── UPDATE RULE VIOLATION ────────────────────────────────
  const handleUpdateRuleViolation = useCallback(
    (productId: string, currentViolation: boolean) => {
      confirm({
        title: currentViolation ? "Gỡ đánh dấu vi phạm?" : "Đánh dấu vi phạm?",
        description: currentViolation
          ? "Sản phẩm này sẽ được gỡ khỏi danh sách vi phạm quy tắc."
          : "Sản phẩm này sẽ bị đánh dấu là vi phạm quy tắc.",
        confirmLabel: currentViolation ? "Gỡ vi phạm" : "Đánh dấu vi phạm",
        variant: currentViolation ? "info" : "danger",
        onConfirm: async () => {
          try {
            await ProductService.updateRuleViolation(
              productId,
              !currentViolation,
            );
            showSuccess(
              currentViolation
                ? "Đã gỡ đánh dấu vi phạm thành công"
                : "Đã đánh dấu vi phạm thành công",
            );
            setProductModalOpen(false);
            fetchProducts(currentProductPage, productSearchTerm || undefined);
          } catch (err: any) {
            showError(err?.message ?? "Có lỗi xảy ra");
          }
        },
      });
    },
    [
      confirm,
      showSuccess,
      showError,
      fetchProducts,
      currentProductPage,
      productSearchTerm,
    ],
  );

  // ─── PRODUCT PAGINATION ───────────────────────────────────
  const handleProductPageChange = useCallback(
    (newPage: number) => {
      setCurrentProductPage(newPage);
      fetchProducts(newPage, productSearchTerm || undefined);
    },
    [fetchProducts, productSearchTerm],
  );

  // ─── PRODUCT SEARCH (debounce) ────────────────────────────
  const handleProductSearch = useCallback((name: string) => {
    setProductSearchTerm(name);
    setCurrentProductPage(0);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(0, productSearchTerm || undefined);
    }, 400);
    return () => clearTimeout(timer);
  }, [productSearchTerm]);

  // ─── ORDER PAGINATION (client-side) ──────────────────────
  const handleOrderPageChange = useCallback((newPage: number) => {
    setCurrentOrderPage(newPage);
  }, []);

  const recentOrders = orders.slice(0, RECENT_ORDER_LIMIT);
  const totalOrderPages = Math.ceil(recentOrders.length / ORDER_PAGE_SIZE);
  const pagedOrders = recentOrders.slice(
    currentOrderPage * ORDER_PAGE_SIZE,
    (currentOrderPage + 1) * ORDER_PAGE_SIZE,
  );

  // USE EFFECT
  useEffect(() => {
    fetchById();
    setCurrentOrderPage(0);
  }, [vendorId]);

  return {
    vendor,
    pagedOrders,
    currentOrderPage,
    totalOrderPages,
    handleOrderPageChange,
    productPage,
    currentProductPage,
    handleProductPageChange,
    isLoading,
    errorMsg,
    // product search
    productSearchTerm,
    handleProductSearch,
    // product modal
    selectedProduct,
    productModalOpen,
    handleOpenProductModal,
    handleCloseProductModal,
    // order modal
    selectedOrder,
    orderModalOpen,
    handleOpenOrderModal,
    handleCloseOrderModal,
    // rule violation
    handleUpdateRuleViolation,
    // toast & confirm
    toasts,
    removeToast,
    confirmState,
    isConfirmOpen,
    closeConfirm,
  };
};
