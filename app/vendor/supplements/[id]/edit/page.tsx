'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VendorSidebar } from '@/components/vendor-sidebar'
import { useFirebaseUpload } from "@/hooks/useFirebaseUpload"

const mockSupplement = {
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
  imageUrl: "https://via.placeholder.com/400x300",
  active: true,
}

export default function SupplementEditPage({ params }: { params: { id: string } }) {

  const [formData, setFormData] = useState(mockSupplement)
  const [loadingEdit, setLoading] = useState(false)

  const { uploadImage, progress, loading } = useFirebaseUpload()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0]
    if (!file) return

    const imageUrl = await uploadImage(file)

    setFormData(prev => ({
      ...prev,
      imageUrl: imageUrl
    }))
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {

    const { name, value, type } = e.target

    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)

    await new Promise(resolve => setTimeout(resolve, 1000))

    setLoading(false)
  }

  const handleLogSupplement = () => {

    const supplementJson = {
      supplementId: mockSupplement.supplementId,
      name: formData.name,
      description: formData.description,
      brand: formData.brand,
      form: formData.form,
      usageInstructions: formData.usageInstructions,
      benefits: formData.benefits,
      sideEffects: formData.sideEffects,
      contraindications: formData.contraindications,
      warnings: formData.warnings,
      imageUrl: formData.imageUrl,
      active: formData.active
    }

    console.log(JSON.stringify(supplementJson, null, 2))
  }

  return (
    <div className="flex min-h-screen bg-orange-50">
      <VendorSidebar />

      <div className="max-w-4xl mx-auto px-4 py-8">

        <Link
          href={`/vendor/supplements/${params.id}`}
          className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6"
        >
          <ArrowLeft size={20} />
          <span>Quay lại</span>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-orange-900">
            Chỉnh sửa chất bổ sung
          </h1>
          <p className="text-orange-600 mt-1">
            Cập nhật thông tin chi tiết chất bổ sung
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-6">

            <h2 className="text-xl font-semibold text-orange-900 mb-6 pb-4 border-b border-orange-200">
              Thông tin cơ bản
            </h2>

            <div className="grid grid-cols-2 gap-6">

              <div>
                <label className="block text-sm font-medium text-orange-900 mb-2">
                  Tên chất bổ sung
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-900 mb-2">
                  Thương hiệu
                </label>

                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-900 mb-2">
                  Hình thức
                </label>

                <select
                  name="form"
                  value={formData.form}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option>Tablet</option>
                  <option>Powder</option>
                  <option>Liquid</option>
                  <option>Capsule</option>
                  <option>Softgel</option>
                </select>
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleInputChange}
                    className="w-4 h-4 accent-orange-600"
                  />
                  <span className="text-sm text-orange-900">
                    Kích hoạt sản phẩm
                  </span>
                </label>
              </div>

            </div>

            {/* Description */}
            <div className="mt-6">

              <label className="block text-sm font-medium text-orange-900 mb-2">
                Mô tả
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Benefits */}
            <div className="mt-6">

              <label className="block text-sm font-medium text-orange-900 mb-2">
                Lợi ích
              </label>

              <textarea
                name="benefits"
                value={formData.benefits}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

          </div>

          {/* Image Upload */}
          <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-6">

            <h2 className="text-xl font-semibold text-orange-900 mb-6 pb-4 border-b border-orange-200">
              Hình ảnh
            </h2>

            <div className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center hover:bg-orange-50">

              <Upload size={40} className="text-orange-500 mx-auto mb-3" />

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />

              {loading && (
                <p className="text-sm text-orange-600 mt-2">
                  Uploading {progress}%
                </p>
              )}

            </div>

            {formData.imageUrl && (
              <div className="mt-6">

                <img
                  src={formData.imageUrl}
                  className="w-32 h-32 rounded-lg object-cover"
                />

              </div>
            )}

          </div>

          {/* Actions */}

          <div className="flex gap-3 justify-end">

            <Link href={`/vendor/supplements/${params.id}`}>
              <Button variant="outline">
                Hủy
              </Button>
            </Link>

            <Button
              type="submit"
              disabled={loadingEdit}
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleLogSupplement}
            >
              {loadingEdit ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>

          </div>

        </form>

      </div>
    </div>
  )
}