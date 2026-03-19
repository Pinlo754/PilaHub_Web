'use client'

import { VendorSidebar } from '@/components/vendor-sidebar'
import { VendorHeader } from '@/components/vendor-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload, Edit2, Save, X } from 'lucide-react'
import { useState } from 'react'

export default function VendorProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    storeName: 'Decathlon Official Store',
    ownerName: 'Nguyễn Văn A',
    email: 'abc@gmail.com',
    phone: '0123456789',
    address: 'Vinhomes Grand Park, Quận 9, TP. Thủ Đức',
    businessLicenseNo: '0123456789',
    taxNo: '0123456789',
    description: 'Decathlon là thương hiệu thể thao hàng đầu thế giới...',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="flex h-screen bg-orange-50">
      <VendorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <VendorHeader title="Hồ sơ" />
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Thông tin cửa hàng</h2>
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2"
                >
                  <Edit2 size={18} />
                  Chỉnh sửa
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Store Info */}
                <Card className="border-2 border-orange-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Thông tin cửa hàng</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tên cửa hàng</label>
                      <Input
                        name="storeName"
                        value={formData.storeName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="border-2 border-gray-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        disabled={!isEditing}
                        rows={4}
                        className={`w-full px-3 py-2 border-2 rounded-lg ${isEditing ? 'border-gray-200' : 'border-gray-100 bg-gray-50'}`}
                      />
                    </div>
                  </div>
                </Card>

                {/* Owner Info */}
                <Card className="border-2 border-orange-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Thông tin chủ cửa hàng</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                      <Input
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="border-2 border-gray-200"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <Input
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="border-2 border-gray-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                        <Input
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="border-2 border-gray-200"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                      <Input
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="border-2 border-gray-200"
                      />
                    </div>
                  </div>
                </Card>

                {/* Business Info */}
                <Card className="border-2 border-orange-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Thông tin kinh doanh</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Số giấy phép kinh doanh</label>
                      <Input
                        name="businessLicenseNo"
                        value={formData.businessLicenseNo}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="border-2 border-gray-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mã số thuế</label>
                      <Input
                        name="taxNo"
                        value={formData.taxNo}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="border-2 border-gray-200"
                      />
                    </div>
                  </div>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Avatar */}
                <Card className="border-2 border-orange-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Logo cửa hàng</h3>
                  <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-gray-500 text-4xl font-bold">D</span>
                  </div>
                  {isEditing && (
                    <Button className="w-full bg-orange-100 text-orange-600 hover:bg-orange-200 flex items-center justify-center gap-2">
                      <Upload size={18} />
                      Tải lên
                    </Button>
                  )}
                </Card>

                {/* Documents */}
                <Card className="border-2 border-orange-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Giấy phép & Chứng chỉ</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <p className="text-sm font-semibold text-gray-900">Giấy phép kinh doanh</p>
                      <p className="text-xs text-gray-600 mt-1">Chưa tải lên</p>
                      {isEditing && (
                        <Button className="w-full mt-2 bg-orange-100 text-orange-600 hover:bg-orange-200 text-sm py-1 flex items-center justify-center gap-2">
                          <Upload size={16} />
                          Tải PDF
                        </Button>
                      )}
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <p className="text-sm font-semibold text-gray-900">Chứng chỉ sản phẩm</p>
                      <p className="text-xs text-gray-600 mt-1">Chưa tải lên</p>
                      {isEditing && (
                        <Button className="w-full mt-2 bg-orange-100 text-orange-600 hover:bg-orange-200 text-sm py-1 flex items-center justify-center gap-2">
                          <Upload size={16} />
                          Tải PDF
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="space-y-2">
                    <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center gap-2 py-3">
                      <Save size={18} />
                      Lưu thay đổi
                    </Button>
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                      className="w-full border-2 border-gray-200 flex items-center justify-center gap-2 py-3"
                    >
                      <X size={18} />
                      Hủy
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
