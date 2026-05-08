'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getProfile, login } from '@/hooks/auth.service'
import { useRouter, useSearchParams } from 'next/navigation'

export default function VendorLogin() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // State quản lý lỗi và thông báo
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const [verifiedSuccess, setVerifiedSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()

  // CẬP NHẬT: Tự động bắt tham số từ URL khi chuyển hướng từ trang OTP về
  useEffect(() => {
    // 1. Kiểm tra trạng thái xác thực thành công
    if (searchParams.get('verified') === 'true') {
      setVerifiedSuccess('Xác thực thành công, mời bạn đăng nhập lại!')
    }

    // 2. Tự động fill email nếu có tham số email trên URL
    const urlEmail = searchParams.get('email')
    if (urlEmail) {
      setEmail(decodeURIComponent(urlEmail))
    }
  }, [searchParams])

  // Hàm validate phía client
  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!email.trim()) {
      newErrors.email = 'Email không được để trống'
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        newErrors.email = 'Email không đúng định dạng'
      }
    }

    if (!password) {
      newErrors.password = 'Mật khẩu không được để trống'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError(null)
    setVerifiedSuccess(null) 

    if (!validateForm()) return

    setIsLoading(true)
    const res = await login({ email, password })

    if (res.ok) {
      const profileRes = await getProfile()

      if (!profileRes.ok || !profileRes.data) {
        setApiError('Không lấy được thông tin người dùng sau khi đăng nhập')
        setIsLoading(false)
        return
      }

      const role = profileRes.data.role
      console.log('Role:', role)
      setIsLoading(false)

      if (role === 'VENDOR') {
        router.push('/vendor/dashboard')
      } else if (role === 'ADMIN') {
        router.push('/')
      } else {
        router.push('/vendor/dashboard')
      }
    } else {
      setIsLoading(false)
      setApiError(res.message || 'Tài khoản hoặc mật khẩu không chính xác')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold mb-4">
            P
          </div>
          <h1 className="text-3xl font-bold text-gray-900">PilaHub</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-lg p-8 space-y-5">
          
          {/* Thông báo Xác thực OTP thành công */}
          {verifiedSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm text-center font-medium shadow-sm">
              {verifiedSuccess}
            </div>
          )}

          {/* Thông báo lỗi đăng nhập từ API */}
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
              placeholder="vendor@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) setErrors(prev => ({ ...prev, email: '' }))
              }}
              className="border-2 border-gray-200 hover:border-orange-200 focus:border-orange-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errors.password) setErrors(prev => ({ ...prev, password: '' }))
                }}
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
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-gray-300 accent-orange-500" />
              <span className="text-sm text-gray-600 select-none">Nhớ mật khẩu</span>
            </label>
            <Link href="/vendor/forgot-password" className="text-sm text-orange-600 hover:text-orange-700">
              Quên mật khẩu?
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
          </Button>
        </form>

        {/* Sign Up Link */}
        <p className="text-center mt-6 text-gray-600">
          Chưa có tài khoản?{' '}
          <Link href="/vendor/register" className="text-orange-600 font-semibold hover:text-orange-700">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  )
}