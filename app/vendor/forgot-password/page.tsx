'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, ShieldAlert, Eye, EyeOff, Lock, KeyRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { AccountService } from '@/hooks/account.service'
import { toast } from "sonner"
export default function ForgotPassword() {
  const router = useRouter()

  // Dữ liệu Form
  const [email, setEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [newPassword, setNewPassword] = useState('')

  // Quản lý trạng thái UI
  const [showPassword, setShowPassword] = useState(false)
  const [isOtpSent, setIsOtpSent] = useState(false) // Kiểm soát ẩn/hiện tầng nhập OTP & Pass mới
  const [countdown, setCountdown] = useState(0) // Đếm ngược nút gửi lại OTP

  // Quản lý lỗi & Thông báo
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const [apiSuccess, setApiSuccess] = useState<string | null>(null)
  const [isLoadingOtp, setIsLoadingOtp] = useState(false)
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)

  // Hiệu ứng đếm ngược thời gian cho nút gửi OTP
  useEffect(() => {
    if (countdown <= 0) return
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  // Lọc định dạng Email
  const validateEmailOnly = () => {
    if (!email.trim()) {
      setErrors({ email: 'Vui lòng nhập email để nhận OTP' })
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setErrors({ email: 'Email không đúng định dạng' })
      return false
    }
    setErrors({})
    return true
  }

  // Validate toàn bộ form trước khi đổi pass
  const validateFullForm = () => {
    const newErrors: Record<string, string> = {}
    if (!email.trim()) newErrors.email = 'Email không được để trống'

    if (!otpCode.trim()) {
      newErrors.otpCode = 'Vui lòng nhập mã OTP'
    } else if (otpCode.length < 4) {
      newErrors.otpCode = 'Mã OTP không hợp lệ'
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

    if (!newPassword) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới'
    } else if (!passwordRegex.test(newPassword)) {
      newErrors.newPassword = 'Mật khẩu phải từ 8 ký tự trở lên, bao gồm ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // HÀNH ĐỘNG 1: Chỉ gửi mã OTP
  const handleSendOtp = async () => {
    if (!validateEmailOnly() || countdown > 0) return

    setIsLoadingOtp(true)
    setApiError(null)
    setApiSuccess(null)

    try {
      // Gọi API gửi OTP
      await AccountService.fortgotPassword({ 'email': email })

      // Nếu API thành công (không nhảy vào catch)
      setIsOtpSent(true)
      setCountdown(60)
      setApiSuccess('Mã OTP đã được gửi thành công! Vui lòng kiểm tra hộp thư của bạn.')
    } catch (error: any) {
      // BẮT LỖI TỪ BACKEND KHI GỬI OTP
      const resError = error.response?.data;
      setApiError(resError?.message || 'Không thể gửi mã OTP lúc này. Vui lòng thử lại sau.')
    } finally {
      setIsLoadingOtp(false)
    }
  }

  // HÀNH ĐỘNG 2: Xác nhận OTP và đặt lại mật khẩu mới
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateFullForm()) return

    setIsLoadingSubmit(true)
    setApiError(null)
    setApiSuccess(null)

    try {
      await AccountService.resetPassword({
        'email': email,
        'otpCode': otpCode,
        'newPassword': newPassword
      })

      toast.success("Đặt lại mật khẩu thành công!", {
        description: "Hệ thống đang chuyển hướng bạn về trang đăng nhập...",
      })

      // 2. Chờ 2 giây (2000ms) để người dùng kịp đọc Toast rồi mới đổi trang
      setTimeout(() => {
        router.push(`/login?verified=true&email=${encodeURIComponent(email)}`)
      }, 2000)
    } catch (error: any) {
      console.log("Chi tiết lỗi nhận được tại UI:", error);

      // 1. BẮT LỖI BUSINESS ĐƯỢC THROW TỪ SERVICE CỦA BẠN
      if (error && error.type === "BUSINESS_ERROR") {

        // Map chính xác lỗi OTP để hiển thị ngay dưới ô Input nhập OTP
        if (error.errorCode === "INVALID_OTP" || error.message?.includes("OTP")) {
          setErrors(prev => ({
            ...prev,
            otpCode: "Mã OTP không chính xác hoặc đã hết hạn. Vui lòng thử lại."
          }))
        } else {
          // Các lỗi Business khác (ví dụ: Email không tồn tại, v.v.) thì hiện trên banner tổng
          setApiError(error.message || "Đã có lỗi xảy ra, vui lòng thử lại.")
        }

      }
      // 2. PHÒNG HỜ LỖI HỆ THỐNG (Nếu Axios interceptor không chạy qua tầng Service của bạn)
      else if (error.response?.data) {
        const resError = error.response.data;

        if (resError.errorCode === "INVALID_OTP") {
          setErrors(prev => ({ ...prev, otpCode: "Mã OTP không chính xác hoặc đã hết hạn." }))
        } else {
          setApiError(resError.message || "Lỗi hệ thống từ máy chủ.")
        }
      }
      // 3. LỖI MẤT KẾT NỐI MẠNG / SERVER SẬP
      else {
        setApiError("Lỗi kết nối hệ thống. Vui lòng kiểm tra lại đường truyền mạng.")
      }

    } finally {
      setIsLoadingSubmit(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6 border border-gray-100">

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-block p-3 bg-orange-100 text-orange-600 rounded-full mb-2">
              <ShieldAlert size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Quên mật khẩu?</h1>
            <p className="text-sm text-gray-500">
              Nhập email nhận mã xác thực và đặt lại mật khẩu của bạn.
            </p>
          </div>

          {/* Banner Thông báo tổng */}
          {apiError && <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center font-medium">{apiError}</div>}
          {apiSuccess && <div className="p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm text-center font-medium shadow-sm">{apiSuccess}</div>}

          {/* Form wrapper */}
          <form onSubmit={handleResetPassword} className="space-y-4">

            {/* Trường Email + Nút Gửi OTP nằm cạnh nhau */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email tài khoản</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type="email"
                    placeholder="vendor@example.com"
                    value={email}
                    disabled={isOtpSent || isLoadingSubmit} // Khóa khi đã gửi OTP thành công
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email) setErrors(prev => ({ ...prev, email: '' }))
                    }}
                    className="border-2 border-gray-200 hover:border-orange-200 focus:border-orange-500 pl-10 h-11"
                  />
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>

                {/* NÚT GỬI MÃ OTP RIÊNG BIỆT */}
                <Button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isLoadingOtp || countdown > 0 || isLoadingSubmit}
                  className="bg-orange-100 text-orange-700 hover:bg-orange-200 font-semibold px-4 h-11 rounded-lg transition-colors border border-orange-200 whitespace-nowrap text-sm"
                >
                  {isLoadingOtp ? 'Đang gửi...' : countdown > 0 ? `${countdown}s` : isOtpSent ? 'Gửi lại mã' : 'Gửi mã'}
                </Button>
              </div>
              {errors.email && <p className="text-red-500 text-sm font-medium">{errors.email}</p>}
            </div>

            {/* PHẦN TỰ ĐỘNG HIỆN RA SAU KHI GỬI MÃ OTP THÀNH CÔNG */}
            {isOtpSent && (
              <div className="space-y-4 pt-2 border-t border-dashed border-gray-100 animate-in fade-in duration-300">

                {/* Ô nhập mã OTP */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Mã xác thực OTP</label>
                  <div className="relative">
                    <Input
                      type="text"
                      maxLength={6}
                      placeholder="Nhập 6 chữ số"
                      value={otpCode}
                      disabled={isLoadingSubmit}
                      onChange={(e) => {
                        setOtpCode(e.target.value.replace(/[^0-9]/g, ''))
                        if (errors.otpCode) setErrors(prev => ({ ...prev, otpCode: '' }))
                      }}
                      className="border-2 border-gray-200 hover:border-orange-200 focus:border-orange-500 pl-10 font-mono tracking-wider h-11"
                    />
                    <KeyRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                  {errors.otpCode && <p className="text-red-500 text-sm font-medium">{errors.otpCode}</p>}
                </div>

                {/* Ô nhập mật khẩu mới */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={newPassword}
                      disabled={isLoadingSubmit}
                      onChange={(e) => {
                        setNewPassword(e.target.value)
                        if (errors.newPassword) setErrors(prev => ({ ...prev, newPassword: '' }))
                      }}
                      className="border-2 border-gray-200 hover:border-orange-200 focus:border-orange-500 pl-10 pr-10 h-11"
                    />
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.newPassword && <p className="text-red-500 text-sm font-medium">{errors.newPassword}</p>}
                </div>

                {/* NÚT ĐỔI MẬT KHẨU CHÍNH */}
                <Button
                  type="submit"
                  disabled={isLoadingSubmit}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition-colors mt-2 h-11"
                >
                  {isLoadingSubmit ? 'Đang lưu mật khẩu...' : 'Xác nhận đổi mật khẩu'}
                </Button>
              </div>
            )}
          </form>

          {/* Điều hướng về lại Đăng nhập */}
          <div className="text-center pt-2 border-t border-gray-100">
            <Link
              href="/vendor/login"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-600 font-medium transition-colors"
            >
              <ArrowLeft size={16} /> Quay lại trang đăng nhập
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}