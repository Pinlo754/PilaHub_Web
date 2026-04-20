import { useEffect, useState } from "react";
import { VendorService } from "@/hooks/vendor.service";
import { VendorType } from "@/utils/VendorType";
import { OrderType } from "@/utils/OrderType";
import { ProductType } from "@/utils/ProductType";
import { PageResponse } from "@/utils/ApiResType";
import { OrderService } from "@/hooks/order.service";
import { ProductService } from "@/hooks/product.service";

type Props = {
  vendorId: string;
};

const PRODUCT_PAGE_SIZE = 5;
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

  // VARIABLE
  const recentOrders = orders.slice(0, RECENT_ORDER_LIMIT);

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

  const fetchProducts = async (page: number) => {
    setIsLoading(true);
    try {
      const res = await ProductService.getByVendorId(
        vendorId,
        page,
        PRODUCT_PAGE_SIZE,
      );
      setProductPage(res);
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

  // PAGINATION HANDLERS
  const handleProductPageChange = (newPage: number) => {
    setCurrentProductPage(newPage);
    fetchProducts(newPage);
  };

  const handleOrderPageChange = (newPage: number) => {
    setCurrentOrderPage(newPage);
  };

  // DERIVED — slice orders client-side
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
  };
};
