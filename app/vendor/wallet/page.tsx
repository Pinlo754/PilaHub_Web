'use client'

import { VendorSidebar } from '@/components/vendor-sidebar'
import { VendorHeader } from '@/components/vendor-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowUpRight, ArrowDownLeft, Plus, Minus } from 'lucide-react'
import { useState, useEffect } from 'react'
import { WalletService } from '@/hooks/wallet.service'
import { TransactionService } from "@/hooks/transaction.service";

export default function VendorWallet() {

  const [wallet, setWallet] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [showTransferModal, setShowTransferModal] = useState(false)

  const [depositAmount, setDepositAmount] = useState("");
  const [depositDescription, setDepositDescription] = useState("");

  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawAccount, setWithdrawAccount] = useState("");
  const [withdrawName, setWithdrawName] = useState("");
  const [withdrawBank, setWithdrawBank] = useState("bidv");
  const [withdrawNote, setWithdrawNote] = useState("");

  const loadWallet = async () => {
    setLoading(true);

    const res = await WalletService.getMyWallet();

    if (res.success) {
      setWallet(res.data);
      await loadTransactions();
    } else {
      console.error(res.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadWallet();
  }, [])

  const loadTransactions = async () => {
    const res = await TransactionService.getMyTransactions();

    if (res.success) {
      setTransactions(res.data);
    } else {
      console.error(res.message);
    }
  };

  const handleDeposit = async () => {
    const res = await WalletService.deposit({
      amount: Number(depositAmount),
      description: depositDescription,
    });

    if (res) {
      window.open(res.data.paymentUrl, "_blank");
    } else {
      console.error();
    }
  }

  const handleWithdrawal = async () => {

    const payload = {
      recipientName: withdrawName,
      bankAccountNumber: withdrawAccount,
      bankCode: withdrawBank,
      bankName: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam",
      bankLogo: "https://example.com/logo.png",
      amount: Number(withdrawAmount),
      note: withdrawNote,
    };

    const res = await WalletService.withdrawal(payload);

    if (res.success) {
      alert("Yêu cầu rút tiền đã được gửi");

      setShowWithdrawModal(false);
      loadWallet();
      loadTransactions();
    } else {
      alert(res.message);
    }
  };

  if (loading) {
    return <div className="p-10">Loading wallet...</div>
  }

  return (
    <div className="flex h-screen bg-orange-50">
      <VendorSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <VendorHeader title="Ví" />

        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">

            {/* Balance */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <Card className="border-2 border-blue-200 p-6 bg-gradient-to-br from-blue-50 to-blue-100">
                <p className="text-gray-600 text-sm mb-2">Tổng số dư</p>
                <p className="text-3xl font-bold text-blue-600">
                  {wallet?.balanceVND?.toLocaleString()}đ
                </p>
              </Card>

              <Card className="border-2 border-green-200 p-6 bg-gradient-to-br from-green-50 to-green-100">
                <p className="text-gray-600 text-sm mb-2">Số dư khả dụng</p>
                <p className="text-3xl font-bold text-green-600">
                  {wallet?.availableVND?.toLocaleString()}đ
                </p>
              </Card>

              <Card className="border-2 border-red-200 p-6 bg-gradient-to-br from-red-50 to-red-100">
                <p className="text-gray-600 text-sm mb-2">Tiền bị khóa</p>
                <p className="text-3xl font-bold text-red-600">
                  {wallet?.lockedVND?.toLocaleString()}đ
                </p>
              </Card>

            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <Button
                onClick={() => setShowDepositModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white py-6"
              >
                <Plus size={20} /> Nạp tiền
              </Button>

              <Button
                onClick={() => setShowWithdrawModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white py-6"
              >
                <Minus size={20} /> Rút tiền
              </Button>

            </div>

            {/* Transactions */}
            <Card className="border-2 border-orange-200 p-6">
              <h3 className="font-semibold mb-4">Lịch sử giao dịch</h3>

              <div className="space-y-3">

                {transactions.map((tx: any) => {

                  const isWithdrawal = tx.transactionType === "WALLET_WITHDRAWAL";
                  const status = tx.referenceId ? "Hoàn thành" : "Đang xử lí";

                  return (
                    <div
                      key={tx.transactionId}
                      className="flex justify-between p-4 bg-orange-50 rounded-lg"
                    >

                      <div className="flex items-center gap-4">

                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isWithdrawal ? "bg-red-100" : "bg-green-100"
                          }`}
                        >
                          {isWithdrawal ? (
                            <ArrowUpRight className="text-red-600" size={20} />
                          ) : (
                            <ArrowDownLeft className="text-green-600" size={20} />
                          )}
                        </div>

                        <div>
                          <p className="font-semibold">{tx.description}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(tx.transactionDate).toLocaleString()}
                          </p>
                        </div>

                      </div>

                      <div className="text-right">

                        <p
                          className={`font-bold text-lg ${
                            isWithdrawal ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          {isWithdrawal ? "-" : "+"}
                          {Number(tx.amount).toLocaleString()}đ
                        </p>

                        <p
                          className={`text-xs font-semibold ${
                            tx.referenceId ? "text-green-600" : "text-orange-500"
                          }`}
                        >
                          {status}
                        </p>

                      </div>

                    </div>
                  );
                })}

              </div>
            </Card>

          </div>
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <Card className="w-96 p-6 space-y-4">

            <h3 className="text-lg font-semibold">Nạp tiền</h3>

            <input
              type="number"
              placeholder="Nhập số tiền"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full border p-2"
            />

            <textarea
              placeholder="Nội dung"
              value={depositDescription}
              onChange={(e) => setDepositDescription(e.target.value)}
              className="w-full border p-2"
            />

            <div className="flex gap-3">
              <Button className="flex-1 bg-green-600" onClick={handleDeposit}>
                Xác nhận
              </Button>
              <Button variant="outline" onClick={() => setShowDepositModal(false)}>
                Hủy
              </Button>
            </div>

          </Card>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <Card className="w-96 p-6 space-y-4">

            <h3 className="text-lg font-semibold">Rút tiền</h3>

            <input
              placeholder="Tên người nhận"
              value={withdrawName}
              onChange={(e) => setWithdrawName(e.target.value)}
              className="w-full border p-2"
            />

            <input
              type="number"
              placeholder="Số tiền"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="w-full border p-2"
            />

            <input
              placeholder="Số tài khoản"
              value={withdrawAccount}
              onChange={(e) => setWithdrawAccount(e.target.value)}
              className="w-full border p-2"
            />

            <textarea
              placeholder="Ghi chú"
              value={withdrawNote}
              onChange={(e) => setWithdrawNote(e.target.value)}
              className="w-full border p-2"
            />

            <div className="flex gap-3">
              <Button className="flex-1 bg-red-600" onClick={handleWithdrawal}>
                Rút tiền
              </Button>
              <Button variant="outline" onClick={() => setShowWithdrawModal(false)}>
                Hủy
              </Button>
            </div>

          </Card>
        </div>
      )}

    </div>
  )
}