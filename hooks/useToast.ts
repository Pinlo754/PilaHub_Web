import { useState, useCallback } from "react";
import { ToastData, ToastType } from "@/components/Toast";

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showSuccess = useCallback(
    (message: string) => addToast("success", message),
    [addToast],
  );

  const showError = useCallback(
    (message: string) => addToast("error", message),
    [addToast],
  );

  return { toasts, removeToast, showSuccess, showError };
};
