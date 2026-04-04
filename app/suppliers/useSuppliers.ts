import { useCallback, useEffect, useState } from "react";
import { VendorService } from "@/hooks/vendor.service";
import { VendorType } from "@/utils/VendorType";
import { useRouter } from "next/navigation";

export const useSuppliers = () => {
  // ROUTE
  const router = useRouter();

  // STATE
  const [vendors, setVendors] = useState<VendorType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVendor, setSelectedVendor] = useState<VendorType | null>(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  // API
  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const res = await VendorService.getAll();

      setVendors(res);
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

  const verifyVendor = useCallback(async () => {
    if (!selectedVendor) return;

    setIsLoading(true);
    try {
      await VendorService.verifyVendor(selectedVendor.vendorId);

      onCloseVerifyModal();
      fetchAll();
    } catch (err: unknown) {
      const error = err as { type?: string; message?: string };
      if (error?.type === "BUSINESS_ERROR") {
        setErrorMsg(error.message || "Có lỗi xảy ra khi xác minh");
      } else {
        setErrorMsg("Có lỗi xảy ra khi xác minh");
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedVendor]);

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

  // USE EFFECT
  useEffect(() => {
    fetchAll();
  }, []);

  return {
    vendors,
    isLoading,
    errorMsg,
    fetchAll,
    searchTerm,
    setSearchTerm,
    currentPage,
    onPressVendor,
    onCloseVerifyModal,
    verifyVendor,
    selectedVendor,
    isVerifyModalOpen,
  };
};
