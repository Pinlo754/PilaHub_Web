"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Card } from "@/components/ui/card";
import { PushNotificationService } from "@/hooks/pushNotificationService";

type TargetType = "ALL_TRAINEE" | "ALL_COACH" | "CUSTOM";

export default function AdminNotificationPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState<TargetType>("ALL_TRAINEE");
  const [userIds, setUserIds] = useState(""); // comma separated
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!title || !message) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (target === "CUSTOM" && !userIds.trim()) {
      alert("Vui lòng nhập account ID");
      return;
    }

    try {
      setLoading(true);

      const payload: any = {
        title,
        message,
        target,
      };

      if (target === "CUSTOM") {
        payload.userIds = userIds
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean);
      }

      const res =
        await PushNotificationService.SendPushNotification(payload);

      if (!res.success) throw new Error(res.message);

      alert("✅ Gửi thông báo thành công");

      // reset
      setTitle("");
      setMessage("");
      setUserIds("");
      setTarget("ALL_TRAINEE");
    } catch (err: any) {
      alert("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-orange-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header title="Broadcast Notification" />

        <main className="flex-1 overflow-auto p-6">
          <Card className="max-w-xl mx-auto p-6 border-2 border-orange-200 rounded-2xl shadow-lg space-y-5">

            {/* TITLE */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Tiêu đề
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề..."
                className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* MESSAGE */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Nội dung
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Nhập nội dung thông báo..."
                rows={4}
                className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* TARGET SELECT */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Đối tượng nhận
              </label>
              <select
                value={target}
                onChange={(e) =>
                  setTarget(e.target.value as TargetType)
                }
                className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="ALL_TRAINEE">
                  Toàn bộ Trainee
                </option>
                <option value="ALL_COACH">
                  Toàn bộ Coach
                </option>
                <option value="CUSTOM">
                  Gửi theo Account ID
                </option>
              </select>
            </div>

            {/* ACCOUNT IDs */}
            {target === "CUSTOM" && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Account IDs
                </label>
                <input
                  value={userIds}
                  onChange={(e) => setUserIds(e.target.value)}
                  placeholder="VD: id1, id2, id3"
                  className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Nhập nhiều ID, cách nhau bằng dấu phẩy
                </p>
              </div>
            )}

            {/* BUTTON */}
            <button
              onClick={handleSend}
              disabled={loading}
              className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Đang gửi..." : "Gửi thông báo"}
            </button>
          </Card>
        </main>
      </div>
    </div>
  );
}