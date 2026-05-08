'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { verifyEmail, resendOtp } from '@/hooks/auth.service'
import { RotateCw, ShieldCheck } from 'lucide-react'

// 1. Component con chứa logic xử lý OTP
function VerifyOtpContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const email = searchParams.get('email') || ''

  const [otpCode, setOtpCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const [apiSuccess, setApiSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  // State đếm ngược thời gian gửi lại mã OTP (60 giây)
  const [countdown, setCountdown] = useState(60)

  // Hiệu ứng đếm ngược thời gian
  useEffect(() => {
    if (countdown <= 0) return
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setApiError(null)
    setApiSuccess(null)

    // Validate cục bộ mã OTP
    if (!otpCode.trim()) {
      setError('Vui lòng nhập mã OTP')
      return
    }

    if (otpCode.length < 4) { // Tùy chọn: chỉnh độ dài theo quy định hệ thống của bạn (4 hoặc 6 số)
      setError('Mã OTP không hợp lệ')
      return
    }

    setIsLoading(true)

    // Gọi API đã chuẩn hóa theo cấu trúc AuthResult
    const res = await verifyEmail(email, otpCode)

    setIsLoading(false)

    if (res.ok) {
      // Xác thực thành công -> chuyển hướng sang trang đăng nhập hoặc dashboard tùy luồng của bạn
      router.push(`/login?verified=true&email=${encodeURIComponent(email)}`)
    } else {
      // Thất bại -> Giữ nguyên mã OTP đã nhập và hiển thị thông báo lỗi hệ thống
      if (res.errorCode === 'INVALID_OTP') {
        setApiError('Mã OTP không chính xác hoặc đã hết hạn')
      } else {
        setApiError(res.message || 'Xác thực thất bại, vui lòng thử lại!')
      }
    }
  }

  const handleResend = async () => {
    if (countdown > 0 || !email) return

    setApiError(null)
    setApiSuccess(null)
    setOtpCode('') // Xóa mã OTP cũ khi gửi lại

    const res = await resendOtp(email)

    if (res.ok) {
      setApiSuccess('Mã OTP mới đã được gửi vào Email của bạn!')
      setCountdown(60) // Reset lại bộ đếm ngược thời gian
    } else {
      setApiError(res.message || 'Không thể gửi lại mã vào lúc này.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-md">
        {/* Card xác thực */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6 border border-gray-100">
          
          {/* Tiêu đề & Icon */}
          <div className="text-center space-y-2">
            <div className="inline-block p-3 bg-orange-100 text-orange-600 rounded-full mb-2">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Xác thực tài khoản</h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              Chúng tôi đã gửi một mã xác thực OTP đến email: <br />
              <span className="font-semibold text-gray-700">{email || 'email-của-bạn@example.com'}</span>
            </p>
          </div>

          {/* Khối hiển thị thông báo kết quả/lỗi từ API */}
          {apiError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center font-medium animate-in shake duration-300">
              {apiError}
            </div>
          )}
          {apiSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm text-center font-medium animate-in fade-in zoom-in duration-300">
              {apiSuccess}
            </div>
          )}

          {/* Form nhập OTP */}
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 text-center">
                Nhập mã OTP gồm 6 chữ số
              </label>
              <Input
                type="text"
                maxLength={6}
                placeholder="000000"
                value={otpCode}
                onChange={(e) => {
                  // Chỉ cho phép nhập số
                  const val = e.target.value.replace(/[^0-9]/g, '')
                  setOtpCode(val)
                  if (error) setError(null)
                  if (apiError) setApiError(null)
                }}
                className="border-2 border-gray-200 hover:border-orange-200 focus:border-orange-500 text-center tracking-[0.5em] text-xl font-bold h-12"
              />
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
            </div>

            {/* Nút kích hoạt xác thực */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition-colors mt-2"
            >
              {isLoading ? 'Đang xác thực...' : 'Xác nhận mã'}
            </Button>
          </form>

          {/* Luồng gửi lại mã OTP */}
          <div className="text-center pt-2 border-t border-gray-100 text-sm text-gray-600">
            {countdown > 0 ? (
              <p>
                Bạn có thể yêu cầu gửi lại mã sau{' '}
                <span className="font-bold text-orange-600">{countdown}s</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="inline-flex items-center gap-1.5 text-orange-600 font-semibold hover:text-orange-700 transition-colors"
              >
                <RotateCw size={14} /> Gửi lại mã OTP
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// 2. Component Page chính bọc Suspense
export default function VerifyOtp() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-orange-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-orange-600 font-medium">Đang tải trang xác thực...</p>
          </div>
        </div>
      }
    >
      <VerifyOtpContent />
    </Suspense>
  )
}