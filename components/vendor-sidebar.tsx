'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  RotateCcw,
  Wallet,
  MessageSquare,
  User,
  LogOut,
  Boxes,
} from 'lucide-react'
import { logout } from '@/hooks/auth.service'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
const menuItems = [
  { icon: LayoutDashboard, label: 'Tổng quan', href: '/vendor/dashboard' },
  //{ icon: Boxes, label: 'Kho hàng', href: '/vendor/inventory' },
  { icon: Package, label: 'Sản phẩm', href: '/vendor/products' },
  // { icon: Package, label: 'Chất bổ sung', href: '/vendor/supplements' },
  { icon: ShoppingCart, label: 'Đơn hàng', href: '/vendor/orders' },
  { icon: RotateCcw, label: 'Trả hàng', href: '/vendor/returns' },
  { icon: Wallet, label: 'Ví', href: '/vendor/wallet' },
  // { icon: MessageSquare, label: 'Nhắn tin', href: '/vendor/messages' },
  { icon: User, label: 'Hồ sơ', href: '/vendor/profile' },
]

export function VendorSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const handleLogout = async () => {
    const res = await logout()

    router.push('/login')
  }


  useEffect(() => {
    const user = localStorage.getItem('id')

    if (!user) {
      router.replace('/login')
    }
  }, [])
  return (
    <aside className="w-16 bg-white border-r border-orange-200 flex flex-col items-center py-6 space-y-6">
      {/* Logo */}
      <Link
        href="/vendor/dashboard"
        className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm hover:shadow-lg transition-shadow"
      >
        P
      </Link>

      {/* Menu Items */}
      <nav className="flex-1 flex flex-col gap-4">
        {menuItems.slice(0, -1).map((item) => {
          const Icon = item.icon
          const isActive = pathname?.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${isActive ? 'bg-orange-100 text-orange-600' : 'text-gray-500 hover:bg-orange-50'
                }`}
              title={item.label}
            >
              <Icon size={24} />
            </Link>
          )
        })}
      </nav>

      {/* Profile & Logout */}
      <div className="flex flex-col gap-4 pt-4 border-t border-orange-200">
        <Link
          href="/vendor/profile"
          className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${pathname?.startsWith('/vendor/profile')
              ? 'bg-orange-100 text-orange-600'
              : 'text-gray-500 hover:bg-orange-50'
            }`}
          title="Hồ sơ"
        >
          <User size={24} />
        </Link>
        <button className="w-12 h-12 rounded-lg text-gray-500 hover:bg-orange-50 hover:text-red-600 flex items-center justify-center transition-all"
          onClick={() => handleLogout()}
        >
          <LogOut size={24} />
        </button>
      </div>
    </aside>
  )
}
