'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Package,
  Users,
  BookOpen,
  FileText,
  UserCheck,
  CreditCard,
  LogOut
} from 'lucide-react'
import router from 'next/router'
import { logout } from '@/hooks/auth.service'

const menuItems = [
  {
    icon: LayoutDashboard,
    label: 'Tổng quan',
    href: '/',
  },
  {
    icon: Package,
    label: 'Nhà cung cấp',
    href: '/suppliers',
  },
  {
    icon: Users,
    label: 'Tài khoản',
    href: '/accounts',
  },
  {
    icon: BookOpen,
    label: 'Khóa học',
    href: '/courses',
  },
  {
    icon: FileText,
    label: 'Đơn hàng',
    href: '/orders',
  },
  {
    icon: UserCheck,
    label: 'Nhắn tin',
    href: '/reviews',
  },
  {
    icon: CreditCard,
    label: 'Rút tiền',
    href: '/withdrawals',
  },
]

export function Sidebar() {
  const pathname = usePathname()

    const handleLogout = async () => {
      const res = await logout()
  
      router.push('/login')
    }

  return (
    <aside className="w-16 bg-white border-r border-orange-200 flex flex-col items-center py-6 space-y-6">
      {/* Logo */}
      <Link href="/" className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm hover:shadow-lg transition-shadow">
        P
      </Link>

      {/* Menu Items */}
      <nav className="flex-1 flex flex-col gap-4">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={index}
              href={item.href}
              className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${
                isActive
                  ? 'bg-orange-100 text-orange-600'
                  : 'text-gray-500 hover:bg-orange-50'
              }`}
              title={item.label}
            >
              <Icon size={24} />
            </Link>
          )
        })}
      </nav>
      <button className="w-12 h-12 rounded-lg text-gray-500 hover:bg-orange-50 hover:text-red-600 flex items-center justify-center transition-all"
          onClick={() => handleLogout()}
        >
          <LogOut size={24} />
        </button>
    </aside>
  )
}
