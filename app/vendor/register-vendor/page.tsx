'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useFirebaseUpload } from '@/hooks/useFirebaseUpload'
import { VendorService } from '@/hooks/vendor.service'

export default function VendorRegister() {
    const { uploadFile, loading, progress } = useFirebaseUpload()

    const [formData, setFormData] = useState({
        businessName: '',
        logoUrl: '',
        phoneNumber: '',
        address: '',
        city: '',
        country: '',
        businessLicenseUrl: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    // 🖼️ Upload logo
    const handleUploadLogo = async (file: File) => {
        const url = await uploadFile(file, 'vendor/logo')
        setFormData(prev => ({ ...prev, logoUrl: url }))
    }

    // 📄 Upload PDF
    const handleUploadLicense = async (file: File) => {
        const url = await uploadFile(file, 'vendor/license')
        setFormData(prev => ({ ...prev, businessLicenseUrl: url }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        console.log('Submit:', formData)
        await VendorService.createVendor(formData)
    }

    return (
        <div className="min-h-screen bg-orange-50 flex justify-center items-center p-6">
            <form onSubmit={handleSubmit} className="w-full max-w-3xl space-y-6">

                <h2 className="text-2xl font-bold text-gray-900">
                    Đăng ký trở thành Vendor
                </h2>

                {/* Store Info */}
                <Card className="p-6 space-y-4">
                    <h3 className="font-semibold">Thông tin cửa hàng</h3>

                    <Input
                        name="businessName"
                        placeholder="Tên cửa hàng"
                        value={formData.businessName}
                        onChange={handleChange}
                    />

                    <Input
                        name="phoneNumber"
                        placeholder="Số điện thoại"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                    />
                </Card>

                {/* Address */}
                <Card className="p-6 space-y-4">
                    <h3 className="font-semibold">Địa chỉ</h3>

                    <Input
                        name="country"
                        placeholder="Quốc gia"
                        value={formData.country}
                        onChange={handleChange}
                    />

                    <Input
                        name="city"
                        placeholder="Thành phố"
                        value={formData.city}
                        onChange={handleChange}
                    />

                    <Input
                        name="address"
                        placeholder="Địa chỉ chi tiết"
                        value={formData.address}
                        onChange={handleChange}
                    />
                </Card>

                {/* Logo */}
                <Card className="p-6 space-y-4">
                    <h3 className="font-semibold">Logo cửa hàng</h3>

                    <div className="w-40 h-40 bg-gray-200 rounded-lg flex items-center justify-center">
                        {formData.logoUrl ? (
                            <img
                                src={formData.logoUrl}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        ) : (
                            <span>Preview</span>
                        )}
                    </div>

                    <label>
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleUploadLogo(file)
                            }}
                        />
                        <div className="cursor-pointer bg-orange-100 text-orange-600 px-4 py-2 rounded-lg flex items-center gap-2 w-fit">
                            <Upload size={16} />
                            Upload Logo
                        </div>
                    </label>
                </Card>

                {/* License */}
                <Card className="p-6 space-y-4">
                    <h3 className="font-semibold">Giấy phép kinh doanh</h3>

                    {formData.businessLicenseUrl ? (
                        <iframe
                            src={formData.businessLicenseUrl}
                            className="w-full h-64 border rounded-lg"
                        />
                    ) : (
                        <p className="text-sm text-gray-500">Chưa có file</p>
                    )}

                    <label>
                        <input
                            type="file"
                            accept="application/pdf"
                            hidden
                            onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleUploadLicense(file)
                            }}
                        />
                        <div className="cursor-pointer bg-orange-100 text-orange-600 px-4 py-2 rounded-lg flex items-center gap-2 w-fit">
                            <Upload size={16} />
                            Upload PDF
                        </div>
                    </label>
                </Card>

                {/* Upload progress */}
                {loading && (
                    <p className="text-orange-600 text-sm">
                        Uploading: {progress.toFixed(0)}%
                    </p>
                )}

                {/* Submit */}
                <Button
                    type="submit"
                    className="w-full bg-orange-600 text-white py-3"
                >
                    Đăng ký Vendor
                </Button>
            </form>
        </div>
    )
}