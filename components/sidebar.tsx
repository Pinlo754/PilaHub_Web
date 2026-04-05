"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Users,
  BookOpen,
  FileText,
  UserCheck,
  CreditCard,
  LogOut,
  Truck,
  Store,
  ScrollText,
} from "lucide-react";
import { logout } from "@/hooks/auth.service";
import { useRouter } from "next/navigation";

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Tổng quan",
    href: "/",
  },
  {
    icon: Users,
    label: "Tài khoản",
    href: "/accounts",
  },
  {
    icon: Store,
    label: "Nhà cung cấp",
    href: "/suppliers",
  },
  {
    icon: BookOpen,
    label: "Khóa học",
    href: "/courses",
  },
  // {
  //   icon: BookOpen,
  //   label: "Bài tập",
  //   href: "/exercises",
  // },
  {
    icon: Package,
    label: "Đơn hàng",
    href: "/orders",
  },
  {
    icon: Truck,
    label: "Giả lập GHN",
    href: "/ghn",
  },
  // {
  //   icon: UserCheck,
  //   label: "Nhắn tin",
  //   href: "/reviews",
  // },
  {
    icon: CreditCard,
    label: "Rút tiền",
    href: "/withdrawals",
  },
  {
    icon: ScrollText,
    label: "Giao dịch",
    href: "/transactions",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const res = await logout();

    router.push("/login");
  };

  return (
    <aside className="w-16 bg-white border-r border-orange-200 flex flex-col items-center py-6 space-y-6">
      {/* Logo */}
      <Link
        href="/"
        className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm hover:shadow-lg transition-shadow"
      >
        P
      </Link>

      {/* Menu Items */}
      <nav className="flex-1 flex flex-col gap-4">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={index}
              href={item.href}
              className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${
                isActive
                  ? "bg-orange-100 text-orange-600"
                  : "text-gray-500 hover:bg-orange-50"
              }`}
              title={item.label}
            >
              <Icon size={24} />
            </Link>
          );
        })}
      </nav>
      <button
        className="w-12 h-12 rounded-lg text-gray-500 hover:bg-orange-50 hover:text-red-600 flex items-center justify-center transition-all"
        onClick={() => handleLogout()}
      >
        <LogOut size={24} />
      </button>
    </aside>
  );
}
