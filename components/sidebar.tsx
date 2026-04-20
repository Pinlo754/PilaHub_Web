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
  Dumbbell,
  Boxes,
  Video,
  Bot,
  Settings,
  Grid2X2Plus,
  Pill,
  Goal,
  Bell,
  Flag,
} from "lucide-react";
import { logout } from "@/hooks/auth.service";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

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
    activeRoutes: ["/accounts", "/suppliers", "/trainees", "/coaches"],
  },
  // {
  //   icon: Store,
  //   label: "Nhà cung cấp",
  //   href: "/suppliers",
  // },
  {
    icon: BookOpen,
    label: "Khóa học",
    href: "/courses",
  },
  {
    icon: FileText,
    label: "Bài tập",
    href: "/exercises",
  },
  {
    icon: Dumbbell,
    label: "Thiết bị tập",
    href: "/equipments",
  },
  {
    icon: Boxes,
    label: "Gói dịch vụ",
    href: "/packages",
  },
  {
    icon: Grid2X2Plus,
    label: "Danh mục",
    href: "/categories",
  },
  {
    icon: Pill,
    label: "Nguyên liệu",
    href: "/ingredients",
  },
  {
    icon: Goal,
    label: "Mục tiêu",
    href: "/goals",
  },
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
  {
    icon: Video,
    label: "Giả lập Video Call",
    href: "/videocall",
  },
  {
    icon: Flag,
    label: "Báo cáo",
    href: "/reports",
  },
  {
    icon: Bot,
    label: "Tài liệu AI",
    href: "/ai-document",
  },
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
   {
     icon: Bell,
     label: "Thông báo",
     href: "/notification",
   },
  {
    icon: Settings,
    label: "Cấu hình hệ thống",
    href: "/system-config",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const res = await logout();

    router.push("/login");
  };

  const activeRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
    }
  }, [pathname]);

  return (
    <aside className="w-20 h-screen bg-white border-r border-orange-200 flex flex-col items-center py-6">
      {/* Logo */}
      <Link
        href="/"
        className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm hover:shadow-lg transition-shadow mb-6"
      >
        P
      </Link>

      {/* Menu Items */}
      <nav className="flex-1 flex flex-col ml-3 pr-3 gap-4 overflow-y-auto ">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href ||
                pathname.startsWith(item.href) ||
                item.activeRoutes?.some((route) => pathname.startsWith(route));

          return (
            <Link
              key={index}
              href={item.href}
              ref={isActive ? activeRef : null}
              className={`w-12 h-12 flex-shrink-0 rounded-lg flex items-center justify-center transition-all ${
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
        className="w-12 h-12 mt-6 rounded-lg text-gray-500 hover:bg-orange-50 hover:text-red-600 flex items-center justify-center transition-all"
        onClick={() => handleLogout()}
      >
        <LogOut size={24} />
      </button>
    </aside>
  );
}
