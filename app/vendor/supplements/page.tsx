'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, Plus, Edit2, Eye, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VendorSidebar } from '@/components/vendor-sidebar'
import { SupplementService } from '@/hooks/supplement.service'

const mockSupplements = [
  {
    supplementId: "568dcf53-c349-433d-ab8d-2e3aff32d251",
    name: "Multivitamin for Athletes",
    description: "Complete vitamin and mineral complex",
    brand: "Opti-Men",
    form: "Tablet",
    usageInstructions: "Take 3 tablets daily with meals",
    benefits: "Fills nutritional gaps, supports immune function, energy metabolism",
    sideEffects: "May cause nausea on empty stomach",
    contraindications: "None known",
    warnings: "Do not exceed recommended dose",
    imageUrl: "https://via.placeholder.com/100",
    active: true,
    createdAt: "2026-02-08T10:27:07.304585Z",
  },
  {
    supplementId: "69afbb52-a126-4714-a65b-24bf6c5c9767",
    name: "Creatine Monohydrate",
    description: "Pure creatine for strength and power gains",
    brand: "MuscleTech",
    form: "Powder",
    usageInstructions: "Take 5g daily with water or juice, preferably post-workout",
    benefits: "Increases strength, power output, muscle mass, supports ATP Supplemention",
    sideEffects: "May cause water retention, cramping if under-hydrated",
    contraindications: "Not recommended for individuals under 18",
    warnings: "Stay well hydrated, consult doctor if kidney issues",
    imageUrl: "https://via.placeholder.com/100",
    active: true,
    createdAt: "2026-02-08T10:27:07.304585Z",
  },
]

export default function SupplementsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterForm, setFilterForm] = useState('all')
  const [supplements, setSupplements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const fetchSupplements = async () => {
      try {
        const vendorId =
          typeof window !== 'undefined' ? localStorage.getItem('id') : null

        if (!vendorId) {
          setLoading(false)
          return
        }

        const res = await SupplementService.getMySupplement(vendorId)

        if (res.success && res.data?.length > 0) {
          setSupplements(res.data)
        } else {
          setSupplements(mockSupplements)
        }
      } catch (error) {
        console.error('Fetch Supplements error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSupplements()
  }, [])


  const filteredSupplements = supplements.filter(supp => {
    const matchesSearch = supp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supp.brand.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesForm = filterForm === 'all' || supp.form === filterForm
    return matchesSearch && matchesForm
  })

  return (
    <div className="flex min-h-screen bg-orange-50">
      <VendorSidebar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-orange-900">Quản lý chất bổ sung</h1>
            <p className="text-orange-700 mt-1">Xem và chỉnh sửa thông tin các sản phẩm chất bổ sung</p>
          </div>
          <Link href="/vendor/supplements/new">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              <Plus size={20} className="mr-2" />
              Thêm chất bổ sung
            </Button>
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-4 mb-6">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-xs">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-3 text-orange-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên hoặc thương hiệu..."
                  className="w-full pl-10 pr-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <select
              className="px-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={filterForm}
              onChange={(e) => setFilterForm(e.target.value)}
            >
              <option value="all">Tất cả hình thức</option>
              <option value="Tablet">Viên</option>
              <option value="Powder">Bột</option>
              <option value="Liquid">Chất lỏng</option>
              <option value="Capsule">Viên nang</option>
              <option value="Softgel">Gel mềm</option>
            </select>
          </div>
        </div>

        {/* Supplements Table */}
        <div className="bg-white rounded-lg shadow-sm border border-orange-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-orange-100 border-b border-orange-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900">Tên chất bổ sung</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900">Thương hiệu</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900">Hình thức</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900">Mô tả</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900">Trạng thái</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-orange-900">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredSupplements.map((supp) => (
                  <tr key={supp.supplementId} className="border-b border-orange-100 hover:bg-orange-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={supp.imageUrl}
                          alt={supp.name}
                          className="w-10 h-10 rounded-lg object-cover bg-orange-100"
                        />
                        <p className="font-medium text-orange-900">{supp.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-orange-700">{supp.brand}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                        {supp.form}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-orange-700 max-w-xs truncate">{supp.description}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${supp.active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                        }`}>
                        {supp.active ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <Link href={`/vendor/supplements/${supp.supplementId}`}>
                          <Button variant="ghost" size="sm" className="text-orange-600 hover:bg-orange-100">
                            <Eye size={18} />
                          </Button>
                        </Link>
                        <Link href={`/vendor/supplements/${supp.supplementId}/edit`}>
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-100">
                            <Edit2 size={18} />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-100">
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredSupplements.length === 0 && (
            <div className="text-center py-12">
              <p className="text-orange-700 text-lg">Không tìm thấy chất bổ sung nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
