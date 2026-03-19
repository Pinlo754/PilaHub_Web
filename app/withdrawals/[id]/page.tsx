'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload, CheckCircle, XCircle, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { useParams } from 'next/navigation'
import { WalletService } from '@/hooks/wallet.service'
import { getProfileById, getTraineeById, getVendorById } from '@/hooks/auth.service'
interface WithdrawalRequest {
  walletWithdrawalId: string
  accountId: string
  recipientName: string
  bankAccountNumber: string
  bankCode: string
  bankName: string
  bankLogo: string
  amount: number
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED'
  note: string
  adminNote: string | null
  processedBy: string | null
  requestedAt: string
  processedAt: string | null
  completedAt: string | null
  updatedAt: string | null
}

const withdrawal: WithdrawalRequest = {
  walletWithdrawalId: 'e28afde8-9467-4395-a011-a0da916af333',
  accountId: '96c3c3ca-bafa-4deb-bf7d-cf1f1055b681',
  recipientName: 'ntp chu ai',
  bankAccountNumber: '1021950955',
  bankCode: 'bidv',
  bankName: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam',
  bankLogo: 'https://example.com/logo.png',
  amount: 1000000,
  status: 'PENDING',
  note: 'abc def',
  adminNote: null,
  processedBy: null,
  requestedAt: '2026-03-17T20:23:51.479371Z',
  processedAt: null,
  completedAt: null,
  updatedAt: null,
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'PENDING':
      return <span className="px-4 py-2 rounded-lg text-sm font-semibold bg-yellow-100 text-yellow-700">Chờ xử lý</span>
    case 'COMPLETED':
      return <span className="px-4 py-2 rounded-lg text-sm font-semibold bg-green-100 text-green-700">Hoàn tất</span>
    case 'CANCELLED':
      return <span className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-100 text-red-700">Đã hủy</span>
    default:
      return <span className="px-4 py-2 rounded-lg text-sm font-semibold bg-gray-100 text-gray-700">{status}</span>
  }
}

interface UserProfile {
  accountId: string
  name: string
  email: string
  phoneNumber: string
  role: string
}

interface VendorProfile {
  businessName: string
  businessAddress: string
}

interface TraineeProfile {
  fullName: string
  dob: string
}

export default function WithdrawalDetailPage() {

  const params = useParams()
  const id = params?.id as string
  const [receiptImage, setReceiptImage] = useState<File | null>(null)
  const [receiptPreview, setReceiptPreview] = useState<string>('')
  const [adminNote, setAdminNote] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [withdrawal, setWithdrawal] = useState<WithdrawalRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [vendorProfile, setVendorProfile] = useState<VendorProfile | null>(null)
  const [traineeProfile, setTraineeProfile] = useState<TraineeProfile | null>(null)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setReceiptImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleApprove = async () => {
    setIsProcessing(true)
    await WalletService.completeWithdrawal(id);
    fetchDetail()
    setTimeout(() => {
      alert('Hoàn tất yêu cầu rút tiền!')
      setIsProcessing(false)
    }, 1500)
  }

  const handleReject = async () => {
    if (!adminNote.trim()) {
      alert('Vui lòng nhập lý do từ chối')
      return
    }
    setIsProcessing(true)
    await WalletService.rejectWithdrawal(id);
    fetchDetail()
    setTimeout(() => {
      alert('Từ chối yêu cầu rút tiền!')
      setIsProcessing(false)
    }, 1500)
  }

  const fetchDetail = async () => {
    try {
      const res = await WalletService.getRequestById(id)

      if (res.success) {
        setWithdrawal(res.data)
      } else {
        console.error(res.message)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!id) return

    const fetchDetail = async () => {
      try {
        const res = await WalletService.getRequestById(id)

        if (res.success) {
          setWithdrawal(res.data)
        } else {
          console.error(res.message)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchDetail()
  }, [id])

  useEffect(() => {
    if (!withdrawal?.accountId) return

    const fetchUser = async () => {
      try {
        const res = await getProfileById(withdrawal.accountId)

        if (res.ok) {
          setUser(res.data)
        } else {
          console.error(res.error)
        }
      } catch (err) {
        console.error(err)
      }
    }

    fetchUser()
  }, [withdrawal])

  useEffect(() => {
    if (!user?.accountId || !user?.role) return

    const fetchRoleProfile = async () => {
      try {
        if (user.role === 'VENDOR') {
          const res = await getVendorById(user.accountId)
          if (res.ok) setVendorProfile(res.data)
        }

        if (user.role === 'TRAINEE') {
          const res = await getTraineeById(user.accountId)
          if (res.ok) setTraineeProfile(res.data)
        }
      } catch (err) {
        console.error(err)
      }
    }

    fetchRoleProfile()
  }, [user])

  if (loading) return <div className="p-6">Đang tải...</div>

  if (!withdrawal) return <div className="p-6">Không tìm thấy dữ liệu</div>


  return (
    <div className="min-h-screen bg-orange-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Chi Tiết Yêu Cầu Rút Tiền" />

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <Link href="/withdrawals">
              <Button variant="outline" className="mb-6 border-orange-300 text-orange-600 hover:bg-orange-50">
                <ArrowLeft size={18} className="mr-2" />
                Quay Lại
              </Button>
            </Link>

            {/* Main Content Grid */}
            <div className="grid grid-cols-3 gap-6">
              {/* Left Column - Request Details */}
              <div className="col-span-2">
                {/* Request Card */}
                <div className="bg-white rounded-lg border border-orange-200 p-6 mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-orange-700">Thông Tin Yêu Cầu</h2>
                    {getStatusBadge(withdrawal.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="text-sm text-gray-600 font-medium">Mã Yêu Cầu</label>
                      <div className="mt-1 text-lg font-mono text-gray-800">{withdrawal.walletWithdrawalId}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 font-medium">Số Tiền Rút</label>
                      <div className="mt-1 text-lg font-bold text-green-600">{formatCurrency(withdrawal.amount)}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 font-medium">Tên Người Nhận</label>
                      <div className="mt-1 text-gray-800">{withdrawal.recipientName}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 font-medium">Số Tài Khoản</label>
                      <div className="mt-1 text-gray-800 font-mono">{withdrawal.bankAccountNumber}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 font-medium">Ngân Hàng</label>
                      <div className="mt-1 text-gray-800">{withdrawal.bankName}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 font-medium">Mã Ngân Hàng</label>
                      <div className="mt-1 text-gray-800 font-mono uppercase">{withdrawal.bankCode}</div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 font-medium">Ghi Chú của Vendor</label>
                    <div className="mt-1 p-3 bg-orange-50 rounded-lg text-gray-800">{withdrawal.note || 'Không có ghi chú'}</div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-white rounded-lg border border-orange-200 p-6 mb-6">
                  <h3 className="text-lg font-bold text-orange-700 mb-4">Lịch Sử</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-2 h-2 mt-2 rounded-full bg-orange-500 flex-shrink-0"></div>
                      <div>
                        <div className="font-semibold text-gray-800">Yêu cầu được tạo</div>
                        <div className="text-sm text-gray-600">{formatDate(withdrawal.requestedAt)}</div>
                      </div>
                    </div>
                    {withdrawal.processedAt && (
                      <div className="flex gap-4">
                        <div className="w-2 h-2 mt-2 rounded-full bg-green-500 flex-shrink-0"></div>
                        <div>
                          <div className="font-semibold text-gray-800">Thời gian xử lý</div>
                          <div className="text-sm text-gray-600">{formatDate(withdrawal.processedAt)}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Receipt Upload Section */}
                {withdrawal.status === 'PENDING' && (
                  <div className="bg-white rounded-lg border border-orange-200 p-6">
                    <h3 className="text-lg font-bold text-orange-700 mb-4">Tải Lên Biên Lai Chuyển Tiền</h3>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Chọn Hình Ảnh Biên Lai</label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="receipt-upload"
                        />
                        <label
                          htmlFor="receipt-upload"
                          className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-orange-300 rounded-lg cursor-pointer hover:bg-orange-50 transition-colors"
                        >
                          <div className="text-center">
                            <ImageIcon size={32} className="mx-auto mb-2 text-orange-400" />
                            <div className="text-gray-700 font-medium">Nhấp để chọn hoặc kéo thả hình ảnh</div>
                            <div className="text-sm text-gray-500 mt-1">PNG, JPG hoặc GIF (tối đa 5MB)</div>
                          </div>
                        </label>
                      </div>
                    </div>

                    {receiptPreview && (
                      <div className="mb-6">
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Xem Trước</label>
                        <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                          <img src={receiptPreview} alt="Receipt preview" className="w-full h-full object-contain" />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ghi Chú của Admin</label>
                      <textarea
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                        placeholder="Nhập ghi chú về việc xử lý yêu cầu này..."
                        className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        rows={4}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Actions */}
              <div>
                {/* Action Buttons */}
                <div className="bg-white rounded-lg border border-orange-200 p-6 sticky top-6">
                  <h3 className="text-lg font-bold text-orange-700 mb-4">Hành Động</h3>

                  {withdrawal.status === 'PENDING' ? (
                    <div className="space-y-3">
                      <Button
                        onClick={handleApprove}
                        disabled={!receiptPreview || isProcessing}
                        className="w-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircle size={18} />
                        {isProcessing ? 'Đang xử lý...' : 'Xác Nhận Đã Chuyển Tiền'}
                      </Button>

                      <Button
                        onClick={handleReject}
                        disabled={!adminNote.trim() || isProcessing}
                        variant="outline"
                        className="w-full border-red-300 text-red-600 hover:bg-red-50 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <XCircle size={18} />
                        {isProcessing ? 'Đang xử lý...' : 'Từ Chối Yêu Cầu'}
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="text-gray-600 text-sm">
                        {withdrawal.status === 'COMPLETED' ? 'Yêu cầu này đã được hoàn tất' : 'Yêu cầu này đã bị từ chối'}
                      </div>
                      {withdrawal.adminNote && (
                        <div className="mt-3 p-3 bg-orange-50 rounded-lg text-sm text-gray-700">
                          <strong>Ghi chú:</strong> {withdrawal.adminNote}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Info Card */}

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-sm">

                      {user ? (
                        <div className="space-y-2 text-blue-800">
                          {/* 👇 VENDOR */}
                          {user.role === 'VENDOR' && vendorProfile && (
                            <>
                              <div className="pt-2 font-semibold text-blue-900">Thông tin Shop</div>
                              <div><strong>Tên shop:</strong> {vendorProfile?.businessName}</div>
                            </>
                          )}

                          {/* 👇 TRAINEE */}
                          {user.role === 'TRAINEE' && traineeProfile && (
                            <>
                              <div className="pt-2 font-semibold text-blue-900">Thông tin học viên</div>
                              <div><strong>Họ tên:</strong> {traineeProfile.fullName}</div>
                            </>
                          )}
                          <div>
                            <strong>Email:</strong> {user.email}
                          </div>
                          <div>
                            <strong>Số điện thoại:</strong> {user.phoneNumber}
                          </div>
                          <div>
                            <strong>ID:</strong> {user.accountId}
                          </div>

                          {withdrawal.processedBy && (
                            <div>
                              <strong>Xử lý bởi:</strong> {withdrawal.processedBy}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-blue-700">Đang tải thông tin người dùng...</div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
