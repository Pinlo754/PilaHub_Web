'use client'

import { VendorSidebar } from '@/components/vendor-sidebar'
import { VendorHeader } from '@/components/vendor-header'
import { Card } from '@/components/ui/card'
import { Search, Send, ImageIcon, FileIcon, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface Message {
  id: number
  sender: 'customer' | 'vendor'
  text: string
  time: string
  avatar?: string
}

const conversations = [
  { id: 1, name: 'Timothée Chalamet', lastMessage: 'Ban: Decathlon xin chào, đã...', time: '2p', unread: 1 },
  { id: 2, name: 'Timothée Chalamet', lastMessage: 'Ban: Decathlon xin chào...', time: '2p', unread: 0 },
  { id: 3, name: 'Timothée Chalamet', lastMessage: 'Shop ơi, cho mình hỏi lề ben s...', time: '2h30p', unread: 0 },
]

const messages: Message[] = [
  { id: 1, sender: 'customer', text: 'Ban: Decathlon xin chào, đã...', time: '09:30' },
  { id: 2, sender: 'customer', text: 'Ban: Decathlon xin chào...', time: '09:45' },
  { id: 3, sender: 'vendor', text: 'Chính sách bền mình là ......', time: '10:00' },
  { id: 4, sender: 'customer', text: 'Shop ơi, cho mình hỏi lề ben shop có chính sách đổi trả như nào?', time: '17:31 10/01/2026' },
]

export default function VendorMessages() {
  const [selectedConversation, setSelectedConversation] = useState(1)
  const [messageText, setMessageText] = useState('')

  return (
    <div className="flex h-screen bg-orange-50">
      <VendorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <VendorHeader title="Nhắn tin" />
        <div className="flex-1 flex overflow-hidden">
          {/* Conversations List */}
          <div className="w-80 border-r border-orange-200 flex flex-col bg-white">
            {/* Search */}
            <div className="p-4 border-b border-orange-200">
              <div className="flex items-center gap-2 bg-orange-50 rounded-lg border border-orange-200 px-3 py-2">
                <Search size={18} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="flex-1 bg-transparent outline-none text-sm"
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-orange-200">
              <button className="flex-1 px-4 py-2 text-sm font-medium text-orange-600 border-b-2 border-orange-600">
                Tất cả
              </button>
              <button className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 hover:text-orange-600">
                Chưa đọc
              </button>
              <button className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 hover:text-orange-600">
                Đã ghim
              </button>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`w-full p-4 border-b border-gray-100 text-left hover:bg-orange-50 transition ${
                    selectedConversation === conv.id ? 'bg-orange-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">T</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{conv.name}</p>
                      <p className="text-xs text-gray-600 truncate">{conv.lastMessage}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-gray-500">{conv.time}</span>
                      {conv.unread > 0 && (
                        <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-white">
            {/* Chat Header */}
            <div className="border-b border-orange-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">T</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Timothée Chalamet</p>
                  <p className="text-xs text-gray-500">Hoạt động 6 giờ trước</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-gray-600 hover:bg-orange-50 rounded-lg transition">
                  <span>❤️</span>
                </button>
                <button className="p-2 text-gray-600 hover:bg-orange-50 rounded-lg transition">
                  <span>🎥</span>
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-orange-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'vendor' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'customer' && (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2 flex-shrink-0">
                      <span className="text-white text-xs font-semibold">T</span>
                    </div>
                  )}
                  <div
                    className={`max-w-xs rounded-lg px-4 py-2 ${
                      msg.sender === 'vendor'
                        ? 'bg-orange-600 text-white rounded-br-none'
                        : 'bg-white text-gray-900 rounded-bl-none border border-gray-200'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'vendor' ? 'text-orange-100' : 'text-gray-500'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="border-t border-orange-200 p-4 bg-white">
              <div className="flex items-end gap-2">
                <button className="p-2 text-gray-600 hover:bg-orange-50 rounded-lg transition">
                  <ImageIcon size={20} />
                </button>
                <button className="p-2 text-gray-600 hover:bg-orange-50 rounded-lg transition">
                  <FileIcon size={20} />
                </button>
                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-orange-500"
                />
                <button className="p-2 bg-orange-600 text-white hover:bg-orange-700 rounded-lg transition">
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
