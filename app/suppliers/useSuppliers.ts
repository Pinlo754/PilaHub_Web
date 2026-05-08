import { useCallback, useEffect, useRef, useState } from "react";
import { VendorService } from "@/hooks/vendor.service";
import { VendorType } from "@/utils/VendorType";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { useConfirm } from "@/hooks/useConfirm";

export const useSuppliers = () => {
  // ROUTE
  const router = useRouter();

  // CONSTANTS
  const PAGE_SIZE = 10;
  const DEBOUNCE_MS = 500;

  // HOOk
  const { toasts, removeToast, showSuccess, showError } = useToast();
  const { confirmState, isConfirmOpen, confirm, closeConfirm } = useConfirm();

  // STATE
  const [vendors, setVendors] = useState<VendorType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVendor, setSelectedVendor] = useState<VendorType | null>(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // API
  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const res = await VendorService.getAll();

      setVendors(res);
      setCurrentPage(1);
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

  const fetchByName = async (name: string) => {
    setIsLoading(true);
    try {
      const res = await VendorService.searchByName(name);
      setVendors(res);
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra khi tìm kiếm");
    } finally {
      setIsLoading(false);
    }
  };

  const refresh = async () => {
    if (searchTerm.trim()) await fetchByName(searchTerm.trim());
    else await fetchAll();
  };

  const verifyVendor = (vendor: VendorType) => {
    confirm({
      title: "Xác minh nhà cung cấp?",
      description: `Bạn có chắc muốn xác minh "${vendor.businessName}"? Sau khi xác minh, nhà cung cấp có thể bán hàng trên nền tảng.`,
      confirmLabel: "Xác minh",
      variant: "info",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          await VendorService.verifyVendor(vendor.vendorId);
          showSuccess(`Đã xác minh "${vendor.businessName}" thành công`);
          onCloseVerifyModal();
          await refresh();
        } catch (err: any) {
          showError(err?.message ?? "Có lỗi xảy ra khi xác minh");
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const unverifyVendor = (vendor: VendorType) => {
    confirm({
      title: "Hủy xác minh nhà cung cấp?",
      description: `Bạn có chắc muốn hủy xác minh "${vendor.businessName}"? Nhà cung cấp sẽ không thể bán hàng cho đến khi được xác minh lại.`,
      confirmLabel: "Hủy xác minh",
      variant: "danger",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          await VendorService.unverifyVendor(vendor.vendorId);
          showSuccess(`Đã hủy xác minh "${vendor.businessName}"`);
          onCloseVerifyModal();
          await refresh();
        } catch (err: any) {
          showError(err?.message ?? "Có lỗi xảy ra khi hủy xác minh");
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  // HANDLERS
  const onPressVendor = useCallback(
    (vendor: VendorType) => {
      setSelectedVendor(vendor);
      if (vendor.verified) {
        router.push(`/suppliers/${vendor.vendorId}`);
      } else {
        setIsVerifyModalOpen(true);
      }
    },
    [router],
  );

  const onCloseVerifyModal = useCallback(() => {
    setIsVerifyModalOpen(false);
    setSelectedVendor(null);
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (value.trim() === "") fetchAll();
      else fetchByName(value.trim());
    }, DEBOUNCE_MS);
  };

  // PAGINATION
  const totalPages = Math.max(1, Math.ceil(vendors.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const paginated = vendors.slice(startIndex, startIndex + PAGE_SIZE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // USE EFFECT
  useEffect(() => {
    fetchAll();
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return {
    vendors,
    isLoading,
    errorMsg,
    fetchAll,
    searchTerm,
    setSearchTerm: handleSearchChange,
    currentPage: safePage,
    onPressVendor,
    onCloseVerifyModal,
    verifyVendor,
    selectedVendor,
    isVerifyModalOpen,
    unverifyVendor,
    toasts,
    removeToast,
    confirmState,
    isConfirmOpen,
    closeConfirm,
    paginated,
    totalPages,
    handlePageChange,
    startIndex,
  };
};
