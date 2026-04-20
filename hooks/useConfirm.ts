import { useState, useCallback } from "react";

type ConfirmOptions = {
  title: string;
  description?: string;
  confirmLabel?: string;
  variant?: "danger" | "warning" | "info";
  onConfirm: () => void;
};

export const useConfirm = () => {
  const [state, setState] = useState<ConfirmOptions | null>(null);

  const confirm = useCallback((options: ConfirmOptions) => {
    setState(options);
  }, []);

  const closeConfirm = useCallback(() => {
    setState(null);
  }, []);

  return {
    confirmState: state,
    isConfirmOpen: !!state,
    confirm,
    closeConfirm,
  };
};
