'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getProfile, login } from '@/hooks/auth.service'
import { useRouter } from 'next/navigation'

export default function VendorLogin() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await login({ email, password })

    if (res.ok) {
      const profileRes = await getProfile()

      if (!profileRes.ok || !profileRes.data) {
        alert('Không lấy được thông tin người dùng')
        return
      }

      const role = profileRes.data.role

      console.log('Role:', role)

      // ✅ điều hướng theo role
      if (role === 'VENDOR') {
        router.push('/vendor/dashboard')
      } else if (role === 'ADMIN') {
        router.push('/')
      } else {
        router.push('/') // fallback
      }
    } else {
      console.error(res.error)
      alert(res.error?.message || 'Đăng nhập thất bại')
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
          <p className="text-gray-600 mt-2">Đăng nhập kho bán hàng</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <Input
              type="email"
              placeholder="vendor@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-2 border-gray-200 hover:border-orange-200 focus:border-orange-500"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded border-gray-300 accent-orange-500" />
              <span className="text-sm text-gray-600">Nhớ mật khẩu</span>
            </label>
            <Link href="/vendor/forgot-password" className="text-sm text-orange-600 hover:text-orange-700">
              Quên mật khẩu?
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Đăng nhập
          </Button>
        </form>

        {/* Sign Up Link */}
        <p className="text-center mt-6 text-gray-600">
          Chưa có tài khoản?{' '}
          <Link href="/vendor/register" className="text-orange-600 font-semibold hover:text-orange-700">
            Đăng ký ngay
          </Link>
        </p>

        {/* Info */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Demo:</strong> Sử dụng tài khoản demo để kiểm tra tính năng
          </p>
        </div>
      </div>
    </div>
  )
}
