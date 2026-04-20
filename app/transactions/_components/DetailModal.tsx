"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TransactionType } from "@/utils/TransactionType";
import { AccountService } from "@/hooks/account.service";
import { TransactionService } from "@/hooks/transaction.service";
import { AccountType } from "@/utils/AccountType";
import { formatLocalDateTime } from "@/utils/day";
import { formatVND } from "@/utils/number";
import {
  getTransactionTypeConfig,
  getTransactionFlowConfig,
} from "@/utils/uiMapper";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { Copy, Check } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: TransactionType | null;
};

const DetailModal = ({ open, onOpenChange, transaction }: Props) => {
  const [account, setAccount] = useState<AccountType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [relatedTransactions, setRelatedTransactions] = useState<
    TransactionType[]
  >([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState(false);

  useEffect(() => {
    if (open && transaction) {
      const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const data = await AccountService.getById(transaction.accountId);
          setAccount(data);
        } catch (err: any) {
          setError(err?.message || "Không thể lấy thông tin tài khoản");
        } finally {
          setIsLoading(false);
        }

        if (
          transaction.transactionType === "ORDER" &&
          transaction.referenceId
        ) {
          setIsLoadingRelated(true);
          try {
            const related = await TransactionService.getByReferenceId(
              transaction.referenceId,
            );
            setRelatedTransactions(related);
          } catch {
            setRelatedTransactions([]);
          } finally {
            setIsLoadingRelated(false);
          }
        } else {
          setRelatedTransactions([]);
        }
      };

      fetchData();
    }
  }, [open, transaction]);

  const handleCopy = () => {
    if (!transaction?.referenceId) return;
    navigator.clipboard.writeText(transaction.referenceId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!transaction) return null;

  const flowConfig = getTransactionFlowConfig(transaction.transactionType);
  const typeConfig = getTransactionTypeConfig(transaction.transactionType);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-4xl rounded-2xl max-h-[90vh] overflow-y-auto">
        {isLoading && <LoadingOverlay />}

        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-orange-700">
            Chi tiết giao dịch
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Mã giao dịch */}
          <div className="border-b pb-4">
            <div className="text-sm text-gray-600">Mã giao dịch</div>
            <div className="text-lg font-mono font-semibold text-gray-800 mt-1">
              {transaction.transactionId}
            </div>
          </div>

          {/* Loại giao dịch */}
          <div className="border-b pb-4">
            <div className="text-sm text-gray-600">Loại giao dịch</div>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${typeConfig.bgColor} ${typeConfig.textColor}`}
            >
              {typeConfig.label}
            </span>
          </div>

          {/* Tài khoản */}
          <div className="border-b pb-4">
            <div className="text-sm text-gray-600">Tài khoản</div>
            <div className="mt-2">
              {error ? (
                <p className="text-sm text-red-600">{error}</p>
              ) : account ? (
                <div className="text-gray-800">
                  <div className="font-semibold">{account.email}</div>
                  <div className="text-sm text-gray-600">
                    {account.phoneNumber}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">—</p>
              )}
            </div>
          </div>

          {/* Mô tả */}
          <div className="border-b pb-4">
            <div className="text-sm text-gray-600">Mô tả</div>
            <div className="text-gray-800 mt-1">
              {transaction.description || "—"}
            </div>
          </div>

          {/* Mã tham chiếu + nút copy */}
          <div className="border-b pb-4">
            <div className="text-sm text-gray-600">Mã tham chiếu</div>
            <div className="flex items-center gap-2 mt-1">
              <div className="text-gray-800 font-mono text-sm break-all">
                {transaction.referenceId || "—"}
              </div>
              {transaction.referenceId && (
                <button
                  onClick={handleCopy}
                  className="shrink-0 p-1.5 rounded-lg hover:bg-orange-100 text-orange-600 transition-colors"
                  title="Sao chép mã tham chiếu"
                >
                  {copied ? (
                    <Check size={16} className="text-green-600" />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Số tiền */}
          <div className="border-b pb-4">
            <div className="text-sm text-gray-600">Số tiền</div>
            <div className={`text-2xl font-bold mt-2 ${flowConfig.textColor}`}>
              {flowConfig.sign}
              {formatVND(transaction.amount)}
            </div>
          </div>

          {/* Ngày giao dịch */}
          <div
            className={
              transaction.transactionType === "ORDER" ? "border-b pb-4" : ""
            }
          >
            <div className="text-sm text-gray-600">Ngày giao dịch</div>
            <div className="text-gray-800 mt-1">
              {formatLocalDateTime(transaction.transactionDate)}
            </div>
          </div>

          {/* Luồng tiền (chỉ hiển thị với Order) */}
          {transaction.transactionType === "ORDER" && (
            <div>
              <div className="text-sm font-semibold text-orange-700 mb-3">
                Luồng tiền
              </div>
              {isLoadingRelated ? (
                <div className="text-sm text-gray-400 text-center py-4">
                  Đang tải...
                </div>
              ) : relatedTransactions.length === 0 ? (
                <div className="text-sm text-gray-400 text-center py-4">
                  Không có dữ liệu
                </div>
              ) : (
                <div className="space-y-2">
                  {relatedTransactions.map((t) => {
                    const tTypeConfig = getTransactionTypeConfig(
                      t.transactionType,
                    );
                    const tFlowConfig = getTransactionFlowConfig(
                      t.transactionType,
                    );
                    return (
                      <div
                        key={t.transactionId}
                        className="flex items-start justify-between gap-3 p-3 rounded-xl bg-orange-50 border border-orange-100"
                      >
                        <div className="flex-1 min-w-0">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-1 ${tTypeConfig.bgColor} ${tTypeConfig.textColor}`}
                          >
                            {tTypeConfig.label}
                          </span>
                          <div
                            className="text-xs text-gray-500 truncate"
                            title={t.description}
                          >
                            {t.description || "—"}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">
                            {formatLocalDateTime(t.transactionDate)}
                          </div>
                        </div>
                        <div
                          className={`text-sm font-semibold shrink-0 ${tFlowConfig.textColor}`}
                        >
                          {tFlowConfig.sign}
                          {formatVND(t.amount)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetailModal;
