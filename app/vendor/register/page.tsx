'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function VendorRegister() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    storeName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Register with:', formData)
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
          <p className="text-gray-600 mt-2">Đăng ký kho bán hàng</p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="bg-white rounded-2xl shadow-lg p-8 space-y-4">
          {/* Store Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Tên cửa hàng</label>
            <Input
              type="text"
              name="storeName"
              placeholder="Tên cửa hàng của bạn"
              value={formData.storeName}
              onChange={handleChange}
              className="border-2 border-gray-200 hover:border-orange-200 focus:border-orange-500"
            />
          </div>

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
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
            <Input
              type="tel"
              name="phone"
              placeholder="0123456789"
              value={formData.phone}
              onChange={handleChange}
              className="border-2 border-gray-200 hover:border-orange-200 focus:border-orange-500"
            />
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
          <Link href="/vendor/login" className="text-orange-600 font-semibold hover:text-orange-700">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  )
}
