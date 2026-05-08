'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { registerVendor } from '@/hooks/auth.service'
import { useRouter } from 'next/navigation'

export default function VendorRegister() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  })
  const router = useRouter()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (apiError) setApiError(null)
  }

  const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault()
  setApiError(null)

  if (!validate()) return

  // KHÔNG CẦN TRY...CATCH NỮA! Service đã lo hết lỗi
  const res = await registerVendor(formData)

  if (res.ok) {
    // Thành công (Tương ứng API 201 Created sạch sẽ)
    router.push('/vendor/verify-otp?email=' + formData.email)
  } else {
    // Thất bại: Giữ nguyên state form và check errorCode từ Service trả về
    if (res.errorCode === 'DUPLICATE_ACCOUNT') {
      setApiError('Email hoặc Số điện thoại đã tồn tại')
    } else {
      setApiError(res.message) // Hiển thị câu thông báo lỗi mặc định từ hệ thống
    }
  }
}

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống'
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Số điện thoại không được để trống'
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống'
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Mật khẩu phải từ 8 ký tự trở lên, bao gồm ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'Bạn phải đồng ý với điều khoản dịch vụ'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold mb-4">
            P
          </div>
          <h1 className="text-3xl font-bold text-gray-900">PilaHub</h1>
          <p className="text-gray-600 mt-2">Đăng ký cửa hàng trên PilaHub</p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="bg-white rounded-2xl shadow-lg p-8 space-y-4">
          
          {apiError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center font-medium">
              {apiError}
            </div>
          )}

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <Input
              type="email"
              name="email"
              placeholder="vendor@example.com"
              value={formData.email}
              onChange={handleChange}
              className="border-2 border-gray-200 hover:border-orange-200 focus:border-orange-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
            <Input
              type="tel"
              name="phoneNumber"
              placeholder="0123456789"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="border-2 border-gray-200 hover:border-orange-200 focus:border-orange-500"
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="border-2 border-gray-200 hover:border-orange-200 focus:border-orange-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm max-w-xs leading-relaxed">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="border-2 border-gray-200 hover:border-orange-200 focus:border-orange-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Terms */}
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="mt-1 rounded border-gray-300 accent-orange-500"
            />
            <span className="text-sm text-gray-600">
              Tôi đồng ý với{' '}
              <Link href="#" className="text-orange-600 hover:text-orange-700 font-semibold">
                điều khoản dịch vụ
              </Link>
              {' '}và{' '}
              <Link href="#" className="text-orange-600 hover:text-orange-700 font-semibold">
                chính sách bảo mật
              </Link>
            </span>
          </label>
          {errors.agreeTerms && (
            <p className="text-red-500 text-sm">{errors.agreeTerms}</p>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition-colors mt-6"
          >
            Tạo tài khoản
          </Button>
        </form>

        {/* Sign In Link */}
        <p className="text-center mt-6 text-gray-600">
          Đã có tài khoản?{' '}
          <Link href="/login" className="text-orange-600 font-semibold hover:text-orange-700">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  )
}