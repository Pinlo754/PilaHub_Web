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
  ChevronLeft,
  ChevronRight,
  HeartPulse,
  MessageSquareWarning,
  Ticket,
  Tags,
  Tag,
  Compass,
  Target,
  Leaf,
  RotateCw,
} from "lucide-react";
import { logout } from "@/hooks/auth.service";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

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
    icon: HeartPulse,
    label: "Bộ phận cơ thể",
    href: "/body-parts",
  },
  {
    icon: Dumbbell,
    label: "Thiết bị tập",
    href: "/equipments",
  },
  {
    icon: Target,
    label: "Mục đích",
    href: "/purposes",
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
    label: "Thực phẩm chức năng",
    href: "/supplements",
  },
  {
    icon: Leaf,
    label: "Nguyên liệu",
    href: "/ingredients",
  },
  {
    icon: Goal,
    label: "Mục tiêu tập luyện",
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
    icon: MessageSquareWarning,
    label: "Lý do báo cáo",
    href: "/report-reasons",
  },
  {
    icon: RotateCw,
    label: "Lý do hoàn trả",
    href: "/return-reasons",
  },
  {
    icon: Ticket,
    label: "Đơn hỗ trợ",
    href: "/tickets",
  },
  {
    icon: Tag,
    label: "Loại đơn",
    href: "/ticket-types",
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
  const [expanded, setExpanded] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sidebar-expanded") === "true";
    }
    return false;
  });

  const handleLogout = async () => {
    const res = await logout();

    router.push("/login");
  };

  const activeRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", String(expanded));
  }, [expanded]);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
    }
  }, [pathname]);

  return (
    <aside
      className={`h-screen bg-white border-r border-orange-200 flex flex-col items-center py-6 transition-all duration-300 ease-in-out ${
        expanded ? "w-52" : "w-20"
      }`}
    >
      {/* Logo */}
      <div
        className={`flex items-center mb-6 w-full px-4 ${expanded ? "justify-between" : "justify-center"}`}
      >
        <Link
          href="/"
          className={`${expanded ? "w-16 h-16" : "w-12 h-12"} relative transition-shadow flex-shrink-0 grow-1`}
        >
          <Image
            src="/logo.png"
            alt="PilaHub Logo"
            fill
            className="object-contain rounded-lg"
            priority
          />
        </Link>
        <button
          onClick={() => setExpanded((v) => !v)}
          className={`w-7 h-7 flex-shrink-0 rounded-full border border-orange-200 bg-white flex items-center justify-center text-orange-400 hover:bg-orange-50 transition-all shadow-sm ${
            expanded ? "" : "absolute left-[68px]"
          }`}
          title={expanded ? "Thu nhỏ" : "Mở rộng"}
        >
          {expanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      </div>

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
              className={`flex items-center gap-3 rounded-lg transition-all px-3 h-11 flex-shrink-0 ${
                expanded ? "justify-start" : "justify-center"
              } ${
                isActive
                  ? "bg-orange-100 text-orange-600"
                  : "text-gray-500 hover:bg-orange-50"
              }`}
              title={item.label}
            >
              <Icon size={24} className="flex-shrink-0" />
              {expanded && (
                <span className="text-sm font-medium truncate max-w-[120px]">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <button
        className={`mt-6 mx-3 rounded-lg text-gray-500 hover:bg-orange-50 hover:text-red-600 flex items-center transition-all h-11 px-3 ${
          expanded ? "w-full gap-3 justify-start" : "w-12 justify-center"
        }`}
        onClick={() => handleLogout()}
        title={!expanded ? "Đăng xuất" : undefined}
      >
        <LogOut size={24} className="flex-shrink-0" />
        {expanded && <span className="text-sm font-medium">Đăng xuất</span>}
      </button>
    </aside>
  );
}
