'use client'

import { VendorSidebar } from '@/components/vendor-sidebar'
import { VendorHeader } from '@/components/vendor-header'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Send, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, use, Suspense } from 'react'
import { toast } from 'sonner'
import { TicketService } from '@/hooks/ticket.service'

interface CreateTicketFormProps {
  urlTicketTypeId: string
}

function CreateTicketForm({ urlTicketTypeId }: CreateTicketFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Lấy ID ưu tiên từ dynamic params, nếu không có sẽ lấy từ query string (?ticketType=...)
  const fallbackTypeFromQuery = searchParams.get('ticketType') || ''
  const activeTicketTypeId = urlTicketTypeId || fallbackTypeFromQuery

  const [ticketTypes, setTicketTypes] = useState<any[]>([])
  const [loadingTypes, setLoadingTypes] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    ticketTypeId: '',
    title: '',
    description: ''
  })

  // Fetch danh sách ticket types và xử lý tự động gán giá trị
  useEffect(() => {
    const fetchAndFormSetup = async () => {
      try {
        setLoadingTypes(true)
        const res = await TicketService.getAllType()
        let fetchedTypes: any[] = []

        if (res?.success && res?.data) {
          fetchedTypes = res.data
        } else if (Array.isArray(res)) {
          fetchedTypes = res
        }
        
        setTicketTypes(fetchedTypes)

        // Logic tự động gán (Auto-select): Kiểm tra xem ID nhận từ URL có tồn tại trong mảng data không
        if (activeTicketTypeId && fetchedTypes.length > 0) {
          const matchedType = fetchedTypes.find(
            (t: any) => t.ticketTypeId === activeTicketTypeId
          )
          if (matchedType) {
            setFormData(prev => ({ ...prev, ticketTypeId: matchedType.ticketTypeId }))
          }
        }
      } catch (err) {
        console.error('Lỗi khi lấy danh sách loại hỗ trợ:', err)
        toast.error('Không thể tải danh sách danh mục hỗ trợ từ Admin')
      } finally {
        setLoadingTypes(false)
      }
    }

    fetchAndFormSetup()
  }, [activeTicketTypeId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.ticketTypeId) {
      toast.warning('Vui lòng chọn phân loại hỗ trợ hệ thống!')
      return
    }
    if (!formData.title.trim()) {
      toast.warning('Vui lòng nhập tiêu đề ngắn gọn cho yêu cầu!')
      return
    }
    if (!formData.description.trim()) {
      toast.warning('Vui lòng mô tả chi tiết sự cố bạn đang gặp phải!')
      return
    }

    const createPromise = new Promise(async (resolve, reject) => {
      try {
        setSubmitting(true)
        
        const payload = {
          ticketTypeId: formData.ticketTypeId,
          title: formData.title.trim(),
          description: formData.description.trim()
        }

        const res = await TicketService.createTicket(payload)

        if (res?.success || res) {
          resolve(res)
          setTimeout(() => {
            router.push('/vendor/dashboard')
          }, 1500)
        } else {
          reject(new Error(res || 'Gửi yêu cầu thất bại'))
        }
      } catch (error: any) {
        reject(error)
      } finally {
        setSubmitting(false)
      }
    })

    toast.promise(createPromise, {
      loading: 'Đang khởi tạo kết nối và gửi dữ liệu tới Admin...',
      success: 'Yêu cầu của bạn đã được gửi thành công! 🚀',
      error: (err) => err?.message || 'Có lỗi xảy ra trong quá trình tạo ticket.'
    })
  }

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      <div className="max-w-2xl mx-auto">
        <Card className="border border-orange-200 p-6 sm:p-8 bg-white rounded-2xl shadow-md space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Tạo yêu cầu trợ giúp mới</h2>
            <p className="text-sm text-gray-500 mt-1">
              Gặp sự cố vận hành, lỗi dòng tiền hoặc kiến nghị thêm mới sản phẩm? Hãy tạo ticket gửi tới Admin để nhận hỗ trợ nhanh nhất.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 1. DROP MENU - TICKET TYPE (SHADCN UI) */}
            <div className="space-y-2">
              <Label htmlFor="ticketType" className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Phân loại sự cố <span className="text-red-500">*</span>
              </Label>
              <Select
                disabled={loadingTypes || submitting}
                value={formData.ticketTypeId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, ticketTypeId: value }))}
              >
                <SelectTrigger id="ticketType" className="w-full h-10 border-gray-200 focus:border-orange-400 focus:ring-orange-100 rounded-lg">
                  <SelectValue placeholder={loadingTypes ? "Đang tải danh mục hỗ trợ..." : "Chọn loại sự cố bạn cần hỗ trợ"} />
                </SelectTrigger>
                <SelectContent className="border-orange-100 rounded-lg shadow-lg">
                  {ticketTypes.map((type: any) => (
                    <SelectItem 
                      key={type.ticketTypeId} 
                      value={type.ticketTypeId}
                      className="focus:bg-orange-50 focus:text-orange-900 cursor-pointer text-sm"
                    >
                      {type.name || type.typeName || 'Yêu cầu trợ giúp'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 2. INPUT - TITLE */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Tiêu đề ngắn gọn <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                type="text"
                disabled={submitting}
                placeholder="Ví dụ: Cannot complete payment"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="h-10 border-gray-200 focus-visible:ring-0 focus-visible:border-orange-400 focus:ring-1 focus:ring-orange-100 rounded-lg"
              />
            </div>

            {/* 3. TEXTAREA - DESCRIPTION */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Mô tả chi tiết sự cố <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                disabled={submitting}
                rows={5}
                placeholder="Ví dụ: I tried to pay but got an error code."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="border-gray-200 focus-visible:ring-0 focus-visible:border-orange-400 focus:ring-1 focus:ring-orange-100 rounded-lg resize-none leading-relaxed"
              />
            </div>

            {/* Submit Button Actions */}
            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
              <Button
                type="submit"
                disabled={submitting || loadingTypes}
                className="bg-orange-600 hover:bg-orange-700 text-white rounded-lg px-5 py-2 text-sm font-medium flex items-center gap-2 shadow-md transition-all active:scale-[0.98]"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Đang gửi yêu cầu...
                  </>
                ) : (
                  <>
                    <Send size={14} /> Gửi tới Admin
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

interface PageProps {
  params: Promise<{ ticketTypeId?: string }>
}

export default function CreateTicketPage({ params }: PageProps) {
  const unwrappedParams = use(params)
  const urlTicketTypeId = unwrappedParams?.ticketTypeId || ''

  return (
    <div className="flex h-screen bg-orange-50">
      <VendorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <VendorHeader title="Tạo Ticket Trợ Giúp" />
        
        <Suspense fallback={
          <div className="flex-1 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="animate-spin h-8 w-8 text-orange-500" />
            <span className="text-sm font-medium text-gray-500">Đang đồng bộ dữ liệu tham số...</span>
          </div>
        }>
          <CreateTicketForm urlTicketTypeId={urlTicketTypeId} />
        </Suspense>
      </div>
    </div>
  )
}