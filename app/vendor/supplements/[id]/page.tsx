'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Edit2, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VendorSidebar } from '@/components/vendor-sidebar'
import { SupplementService } from '@/hooks/supplement.service'
import { useParams } from 'next/navigation'

const mockSupplement = {
  supplementId: "568dcf53-c349-433d-ab8d-2e3aff32d251",
  name: "Multivitamin for Athletes",
  description: "Complete vitamin and mineral complex designed for athletes and active individuals",
  brand: "Opti-Men",
  form: "Tablet",
  usageInstructions: "Take 3 tablets daily with meals",
  benefits: "Fills nutritional gaps, supports immune function, energy metabolism, muscle recovery",
  sideEffects: "May cause nausea on empty stomach",
  contraindications: "None known",
  warnings: "Do not exceed recommended dose. Consult healthcare provider if pregnant",
  imageUrl: "https://via.placeholder.com/400x300",
  active: true,
  createdAt: "2026-02-08T10:27:07.304585Z",
  updatedAt: "2026-02-08T10:27:07.304585Z"
}

const infoSections = [
  { label: 'Thương hiệu', value: 'Opti-Men' },
  { label: 'Hình thức', value: 'Viên (Tablet)' },
  { label: 'Liều dùng', value: '3 viên/ngày' },
  { label: 'Dạng đóng gói', value: '120 viên/hộp' },
]

export default function SupplementDetailPage() {

  const params = useParams()
  const id = params?.id as string

  const [activeTab, setActiveTab] = useState('overview')
  const [supplement, setSupplement] = useState<any>(mockSupplement)

  useEffect(() => {
    if (!id) return

    const fetchSupplement = async () => {
      try {
        const res = await SupplementService.getSupplementById(id)

        if (res.success && res.data) {
          setSupplement(res.data)
        } else {
          setSupplement(mockSupplement)
        }

      } catch (err) {
        console.error("Fetch supplement error:", err)
        setSupplement(mockSupplement)
      }
    }

    fetchSupplement()

  }, [id])

  return (
    <div className="flex min-h-screen bg-orange-50">
      <VendorSidebar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <Link href="/vendor/supplements" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6">
          <ArrowLeft size={20} />
          <span>Quay lại</span>
        </Link>

        {/* Supplement Header */}
        <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-6 mb-8">
          <div className="flex gap-8">
            <div className="flex-shrink-0">
              <img
                src={supplement.imageUrl}
                alt={supplement.name}
                className="w-64 h-64 rounded-lg object-cover bg-orange-100"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-orange-900 mb-2">{supplement.name}</h1>
                  <p className="text-orange-600 text-lg font-semibold">{supplement.brand}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical size={20} className="text-orange-600" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-orange-600 mb-1">Hình thức</p>
                  <p className="text-lg font-semibold text-orange-900">{supplement.form}</p>
                </div>
                <div>
                  <p className="text-sm text-orange-600 mb-1">Trạng thái</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    supplement.active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {supplement.active ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </div>
              </div>

              <p className="text-orange-700 mb-6 leading-relaxed">{supplement.description}</p>

              <Link href={`/vendor/supplements/${params.id}/edit`}>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Edit2 size={20} className="mr-2" />
                  Chỉnh sửa chất bổ sung
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-orange-200">
          <div className="flex border-b border-orange-200">
            {['overview', 'usage', 'safety'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium border-b-2 transition ${
                  activeTab === tab
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-orange-700 hover:text-orange-600'
                }`}
              >
                {tab === 'overview' && 'Tổng quan'}
                {tab === 'usage' && 'Cách sử dụng'}
                {tab === 'safety' && 'An toàn'}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-lg font-semibold text-orange-900 mb-4">Mô tả chát bổ sung</h3>
                <p className="text-orange-700 leading-relaxed mb-6">{supplement.description}</p>

                <h3 className="text-lg font-semibold text-orange-900 mb-4">Lợi ích</h3>
                <div className="bg-green-50 rounded-lg p-4 mb-6">
                  <ul className="list-disc list-inside text-orange-700 space-y-2">
                    {supplement.benefits.split(',').map((benefit: any, index: any) => (
                      <li key={index} className="text-sm">{benefit.trim()}</li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {infoSections.map((section, index) => (
                    <div key={index}>
                      <p className="text-sm text-orange-600 font-medium mb-1">{section.label}</p>
                      <p className="text-orange-900 font-semibold">{section.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'usage' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-orange-900 mb-3">Hướng dẫn sử dụng</h3>
                  <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <p className="text-orange-700 leading-relaxed">{supplement.usageInstructions}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-orange-900 mb-3">Liều dùng được khuyến cáo</h3>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <ul className="list-disc list-inside text-orange-700 space-y-2">
                      <li className="text-sm">Liều lượng tiêu chuẩn: 3 viên/ngày</li>
                      <li className="text-sm">Thời gian tốt nhất: Uống cùng bữa ăn chính</li>
                      <li className="text-sm">Thời gian uống: Sáng, trưa, chiều</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'safety' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-orange-900 mb-3 text-red-600">Tác dụng phụ</h3>
                  <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                    <p className="text-orange-700">{supplement.sideEffects}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-orange-900 mb-3">Chống chỉ định</h3>
                  <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
                    <p className="text-orange-700">{supplement.contraindications}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-orange-900 mb-3">Cảnh báo</h3>
                  <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
                    <p className="text-orange-700">{supplement.warnings}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
