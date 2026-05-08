'use client'

import { VendorSidebar } from '@/components/vendor-sidebar'
import { VendorHeader } from '@/components/vendor-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, Check, X, DollarSign, Calendar, Clipboard, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState, use } from 'react'
import { OrderService } from '@/hooks/order.service'
import { toast } from 'sonner'

const statuses = {
  'Chờ xác nhận': 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  'Đã xác nhận': 'bg-blue-50 text-blue-700 border border-blue-200',
  'Đã hoàn tiền': 'bg-green-50 text-green-700 border border-green-200',
  'Từ chối': 'bg-red-50 text-red-700 border border-red-200',
}

const mapStatus = (status: string) => {
  switch (status) {
    case 'PENDING': return 'Chờ xác nhận'
    case 'APPROVED': return 'Đã xác nhận'
    case 'COMPLETED': return 'Đã hoàn tiền'
    case 'REJECTED': return 'Từ chối'
    default: return status
  }
}

interface PageProps {
  params: Promise<{ id: string }>
}

type ActionType = 'APPROVE' | 'REJECT' | 'COMPLETE'

export default function ReturnDetail({ params }: PageProps) {
  const { id: returnId } = use(params)
  
  const [returnDetail, setReturnDetail] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  // State quản lý việc đóng/mở và nội dung của Confirm Modal
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: ActionType | null;
    title: string;
    description: string;
  }>({
    isOpen: false,
    type: null,
    title: '',
    description: ''
  })

  const fetchReturnDetail = async () => {
    try {
      setLoading(true)
      const res = await OrderService.getMyReturn()
      if (res.success && res.data) {
        const found = res.data.find((item: any) => item.returnId === returnId)
        setReturnDetail(found)
      }
    } catch (err) {
      console.error('Lỗi khi lấy chi tiết đơn trả hàng:', err)
      toast.error('Không thể tải thông tin chi tiết yêu cầu')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (returnId) {
      fetchReturnDetail()
    }
  }, [returnId])

  // Khởi chạy modal và cấu hình nội dung hiển thị theo hành động
  const openConfirmModal = (type: ActionType) => {
    const config = {
      APPROVE: {
        title: 'Chấp nhận yêu cầu trả hàng?',
        description: 'Hệ thống sẽ ghi nhận bạn đồng ý nhận lại sản phẩm hoàn trả này. Khách hàng sẽ nhận được thông báo để gửi hàng về.'
      },
      REJECT: {
        title: 'Từ chối yêu cầu trả hàng?',
        description: 'Hành động này không thể hoàn tác. Bạn có chắc chắn muốn từ chối tiếp nhận yêu cầu hoàn trả này từ người mua?'
      },
      COMPLETE: {
        title: 'Xác nhận đã hoàn tiền?',
        description: 'Hãy chắc chắn rằng bạn đã kiểm tra hàng hoàn đầy đủ và không bị hư hỏng. Hành động này sẽ hoàn tất yêu cầu và hoàn tiền cho người mua.'
      }
    }

    setConfirmModal({
      isOpen: true,
      type,
      title: config[type].title,
      description: config[type].description
    })
  }

  // Xử lý gọi API thực tế sau khi nhấn đồng ý trên Modal
  const handleExecuteAction = async () => {
    const actionType = confirmModal.type
    if (!actionType) return

    setConfirmModal(prev => ({ ...prev, isOpen: false }))
    
    // Tạo luồng thông báo dạng hứa (Promise toast)
    const actionPromise = new Promise(async (resolve, reject) => {
      try {
        setSubmitting(true)
        let res: any

        if (actionType === 'APPROVE') {
          res = await OrderService.approveReturn(returnId)
        } else if (actionType === 'REJECT') {
          res = await OrderService.rejectReturn(returnId)
        } else if (actionType === 'COMPLETE') {
          res = await OrderService.completeReturn(returnId)
        }
        
        if (res?.success || res) {
          await fetchReturnDetail() // Cập nhật lại UI sau khi xử lý thành công
          resolve(res)
        } else {
          reject(new Error(res?.message || 'Thao tác không thành công'))
        }
      } catch (error: any) {
        reject(error)
      } finally {
        setSubmitting(false)
      }
    })

    toast.promise(actionPromise, {
      loading: 'Đang xử lý yêu cầu cập nhật lên hệ thống...',
      success: 'Cập nhật trạng thái đơn hoàn trả thành công 🎉',
      error: (err) => err?.message || 'Có lỗi xảy ra trong quá trình thực thi.'
    })
  }

  const totalRefundAmount = returnDetail?.itemReturns?.reduce(
    (sum: number, i: any) => sum + (i.refundAmount || 0), 0
  ) || 0

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-orange-50 space-y-3">
        <Loader2 className="animate-spin h-9 w-9 text-orange-500" />
        <span className="text-sm font-medium text-gray-600">Đang đồng bộ dữ liệu chi tiết...</span>
      </div>
    )
  }

  if (!returnDetail) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-orange-50 text-center p-4">
        <div className="p-4 bg-red-50 rounded-full border border-red-100 mb-4 text-red-500 shadow-sm">
          <AlertCircle size={40} strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Không tìm thấy dữ liệu yêu cầu</h3>
        <p className="text-sm text-gray-500 mt-1 max-w-sm">Mã đơn trả hàng không tồn tại hoặc bạn không có quyền truy cập vào dữ liệu này.</p>
        <Link href="/vendor/returns" className="mt-5 text-sm font-semibold text-orange-600 bg-white border border-orange-200 px-4 py-2 rounded-lg shadow-sm hover:bg-orange-50 transition">
          Quay lại danh sách
        </Link>
      </div>
    )
  }

  const currentStatusMapped = mapStatus(returnDetail.status)

  return (
    <div className="flex h-screen bg-orange-50">
      <VendorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <VendorHeader title="Chi tiết yêu cầu hoàn trả" />
        
        <div className="flex-1 overflow-auto p-6 space-y-6">
          
          {/* Top Bar Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-orange-100 shadow-sm">
            <Link 
              href="/vendor/returns" 
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-orange-600 transition group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> Quay lại danh sách
            </Link>

            {/* Render Button linh hoạt theo Status */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {returnDetail.status === 'PENDING' && (
                <>
                  <Button 
                    disabled={submitting}
                    onClick={() => openConfirmModal('APPROVE')}
                    className="bg-green-600 hover:bg-green-700 text-white text-xs px-4 py-2 flex items-center gap-1.5 shadow-sm rounded-lg"
                  >
                    <Check size={14} /> Đồng ý trả hàng
                  </Button>
                  <Button 
                    disabled={submitting}
                    variant="destructive"
                    onClick={() => openConfirmModal('REJECT')}
                    className="text-xs px-4 py-2 flex items-center gap-1.5 shadow-sm rounded-lg"
                  >
                    <X size={14} /> Từ chối tiếp nhận
                  </Button>
                </>
              )}

              {returnDetail.status === 'APPROVED' && (
                <Button 
                  disabled={submitting}
                  onClick={() => openConfirmModal('COMPLETE')}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-5 py-2.5 flex items-center gap-1.5 shadow-md rounded-lg"
                >
                  <DollarSign size={14} /> Xác nhận đã hoàn tiền
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Box Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border border-orange-200 p-6 bg-white rounded-xl shadow-sm space-y-5">
                <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                  <div>
                    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                      Mã yêu cầu: <span className="text-gray-500 font-mono font-medium">#{returnId.slice(0, 8)}</span>
                    </h2>
                    <p className="text-xs text-gray-400 mt-1 select-all font-mono">{returnId}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide border ${statuses[currentStatusMapped as keyof typeof statuses] || 'bg-gray-100 text-gray-700'}`}>
                    {currentStatusMapped}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <Clipboard size={16} className="text-orange-500" />
                    <div>
                      <p className="text-xs text-gray-400 font-medium">MÃ ĐƠN HÀNG GỐC</p>
                      <span className="font-mono text-xs text-gray-900 font-semibold">{returnDetail.orderId}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <Calendar size={16} className="text-orange-500" />
                    <div>
                      <p className="text-xs text-gray-400 font-medium">NGÀY GỬI YÊU CẦU</p>
                      <span className="text-gray-900 font-medium">{new Date(returnDetail.createdAt).toLocaleString('vi-VN')}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50/60 rounded-xl p-4 border border-orange-100">
                  <span className="text-xs font-bold uppercase text-orange-800 tracking-wider block mb-1.5">Lý do hoàn trả từ người mua:</span>
                  <p className="text-sm text-gray-700 font-medium italic leading-relaxed">"{returnDetail.reason}"</p>
                </div>
              </Card>

              {/* Items Table details */}
              <Card className="border border-orange-200 p-6 bg-white rounded-xl shadow-sm">
                <h3 className="font-bold text-sm text-gray-900 mb-4 border-b border-gray-100 pb-3">Danh sách sản phẩm hệ thống nhận hoàn trả</h3>
                <div className="divide-y divide-gray-100">
                  {returnDetail.itemReturns?.map((item: any) => (
                    <div key={item.itemReturnId} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-2 h-2 rounded-full bg-orange-400" />
                          <p className="font-semibold text-sm text-gray-900">Mã sản phẩm: <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 text-gray-700 ml-1">{item.productId}</span></p>
                        </div>
                        <p className="text-xs text-gray-400 pl-4">ID dòng đơn hàng: {item.orderDetailId}</p>
                        <p className="text-xs text-gray-600 pl-4 font-medium">Số lượng trả hàng: <span className="text-orange-600 font-bold">{item.quantity}</span> sản phẩm</p>
                      </div>
                      <div className="text-left md:text-right pl-4 md:pl-0">
                        <span className="text-xs text-gray-400 block mb-0.5">Số tiền hoàn trả</span>
                        <span className="font-extrabold text-orange-600 text-base">{(item.refundAmount || 0).toLocaleString('vi-VN')}đ</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right Information Summary */}
            <div className="space-y-6">
              <Card className="border border-orange-200 p-6 bg-white rounded-xl shadow-sm h-fit">
                <h3 className="font-bold text-sm text-gray-900 mb-4 border-b border-gray-100 pb-3">Tóm tắt phân phối dòng tiền</h3>
                
                <div className="space-y-3.5 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Số lượng nhóm sản phẩm:</span>
                    <span className="font-semibold text-gray-900">{returnDetail.itemReturns?.length || 0} mục</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Cập nhật tiến độ cuối:</span>
                    <span className="font-semibold text-gray-900">{new Date(returnDetail.updatedAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  
                  <div className="border-t border-dashed border-gray-200 pt-4 mt-4 flex justify-between items-center">
                    <span className="font-bold text-gray-800">Tổng giá trị hoàn trả:</span>
                    <span className="text-2xl font-black text-orange-600 tracking-tight">
                      {totalRefundAmount.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>
              </Card>

              {returnDetail.status === 'COMPLETED' && (
                <div className="bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl p-4 text-xs space-y-1.5 shadow-sm">
                  <p className="font-bold text-emerald-800 flex items-center gap-1.5 text-sm">
                    <span className="flex items-center justify-center w-4 h-4 bg-emerald-600 text-white rounded-full text-[10px]">✓</span> 
                    Quy trình hoàn tất thành công
                  </p>
                  <p className="text-emerald-700 leading-relaxed pl-5">Đơn hoàn trả đã đóng lại. Người mua đã nhận đủ tiền hoàn và hệ thống đã ghi nhận khấu trừ doanh số dòng tiền của ví doanh nghiệp.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* --- CONFIRM DIALOG SYSTEM (SHADCN UI) --- */}
      <AlertDialog open={confirmModal.isOpen} onOpenChange={(open) => setConfirmModal(prev => ({ ...prev, isOpen: open }))}>
        <AlertDialogContent className="rounded-xl max-w-md border-2 border-orange-100">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
              {confirmModal.type === 'REJECT' ? (
                <AlertCircle className="text-red-500" size={20} />
              ) : (
                <AlertCircle className="text-orange-500" size={20} />
              )}
              {confirmModal.title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-500 leading-relaxed pt-1">
              {confirmModal.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 pt-2">
            <AlertDialogCancel className="rounded-lg border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-semibold">
              Hủy bỏ
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleExecuteAction}
              className={`rounded-lg text-xs font-semibold text-white ${
                confirmModal.type === 'REJECT' 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : confirmModal.type === 'COMPLETE' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              Xác nhận thực hiện
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}