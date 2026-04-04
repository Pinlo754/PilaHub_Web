'use client'

import { VendorSidebar } from '@/components/vendor-sidebar'
import { VendorHeader } from '@/components/vendor-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload, Edit2, Save, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Vendor, VendorService } from '@/hooks/vendor.service'
import { useFirebaseUpload } from '@/hooks/useFirebaseUpload'

export default function VendorProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Vendor>({
    businessName: '',
    phoneNumber: '',
    address: '',
    city: '',
    country: '',
    logoUrl: '',
    businessLicenseUrl: '',
  })
  const [updateStatus, setUpdateStatus] = useState('')
  const { uploadFile, uploadImage } = useFirebaseUpload()
  useEffect(() => {

    const vendorId =
      typeof window !== 'undefined'
        ? localStorage.getItem('id')
        : null

    if (!vendorId) {
      return
    }

    const fetchProfile = async () => {
      const res = await VendorService.getVendorById(vendorId)

      if (res) {
        setFormData(res.data)
      }
    }

    fetchProfile()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    const vendorId =
      typeof window !== 'undefined'
        ? localStorage.getItem('id')
        : null

    if (!vendorId) {
      return
    }

    const res = await VendorService.updateVendor(vendorId, formData)

    if (res) {
      setUpdateStatus('Thành công')
    }
  }

  const handleUploadLogo = async (file: File) => {
    const url = await uploadFile(file, "vendor/logo")

    setFormData(prev => ({
      ...prev,
      logoUrl: url
    }))
  }

  const handleUploadLicense = async (file: File) => {
    const url = await uploadFile(file, "vendor/license")

    setFormData(prev => ({
      ...prev,
      businessLicenseUrl: url
    }))
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
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                      <Input
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quốc gia</label>
                      <Input
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    {/* Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                      <Input
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Thành phố</label>
                      <Input
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </Card>

                {/* Business Info */}
                <Card className="border-2 border-orange-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Thông tin kinh doanh</h3>
                  <div className="space-y-4">
                    {formData.businessLicenseUrl ? (
                      <div className="space-y-2">
                        <iframe
                          src={formData.businessLicenseUrl}
                          className="w-full h-64 rounded-lg border"
                        />
                        <a
                          href={formData.businessLicenseUrl}
                          target="_blank"
                          className="text-blue-500 text-sm"
                        >
                          Mở toàn màn hình
                        </a>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-600 mt-1">Chưa tải lên</p>
                    )}
                  </div>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Avatar */}
                <Card className="border-2 border-orange-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Logo cửa hàng</h3>
                  <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                    {formData.logoUrl ? (
                      <img
                        src={formData.logoUrl}
                        alt="logo"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-gray-500 text-4xl font-bold">?</span>
                    )}
                  </div>
                  {isEditing && (
                    <label className="w-full">
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (!file) return

                          const url = await uploadFile(file, "vendor/logo")

                          setFormData(prev => ({
                            ...prev,
                            logoUrl: url
                          }))
                        }}
                      />
                      <div className="w-full bg-orange-100 text-orange-600 hover:bg-orange-200 flex items-center justify-center gap-2 py-2 rounded-lg cursor-pointer">
                        <Upload size={18} />
                        Tải logo
                      </div>
                    </label>
                  )}
                </Card>

                {/* Documents */}
                <Card className="border-2 border-orange-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Giấy phép & Chứng chỉ</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <p className="text-sm font-semibold text-gray-900">PDF Giấy tờ</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {formData.businessLicenseUrl ? 'Đã tải lên' : 'Chưa tải lên'}
                      </p>
                      {isEditing && (
                        <label className="w-full mt-2">
                          <input
                            type="file"
                            accept="application/pdf"
                            hidden
                            onChange={async (e) => {
                              const file = e.target.files?.[0]
                              if (!file) return

                              const url = await uploadFile(file, "vendor/license")

                              setFormData(prev => ({
                                ...prev,
                                businessLicenseUrl: url
                              }))
                            }}
                          />
                          <div className="w-full bg-orange-100 text-orange-600 hover:bg-orange-200 text-sm py-1 flex items-center justify-center gap-2 rounded-lg cursor-pointer">
                            <Upload size={16} />
                            Tải PDF
                          </div>
                        </label>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="space-y-2">
                    <Button
                      onClick={handleSave}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center gap-2 py-3">
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
