'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VendorSidebar } from '@/components/vendor-sidebar'
import { useFirebaseUpload } from '@/hooks/useFirebaseUpload'
import { ProductService } from '@/hooks/product.service'

type Product = {
    productId: string
    categoryId: string
    refId?: string // 👈 thêm
    name: string
    description: string
    imageUrl: string
    price: number | string
    stockQuantity: number | string
    brand: string
    specifications: string
    height: number | string
    length: number | string
    width: number | string
    weight: number | string
    installationSupported: boolean
    regionSupported: string[]
}

const VIETNAM_PROVINCES = [
    { label: 'Hà Nội', value: 'HN' },
    { label: 'Hồ Chí Minh', value: 'HCM' },
    { label: 'Đà Nẵng', value: 'DN' },
    { label: 'Hải Phòng', value: 'HP' },
    { label: 'Cần Thơ', value: 'CT' },
    { label: 'Bình Dương', value: 'BD' },
    { label: 'Đồng Nai', value: 'DNA' }
]

const initialState: Product = {
    productId: '',
    categoryId: '',
    refId: '',
    name: '',
    description: '',
    imageUrl: '',
    price: '',
    stockQuantity: '',
    brand: '',
    specifications: '',
    height: '',
    length: '',
    width: '',
    weight: '',
    installationSupported: false,
    regionSupported: []
}

export default function ProductFormPage() {
    const [formData, setFormData] = useState<Product>(initialState)
    const [loadingPage, setLoadingPage] = useState(true)
    const [loadingSubmit, setLoadingSubmit] = useState(false)

    const { uploadImage, loading: uploading } = useFirebaseUpload()

    const params = useParams()
    const router = useRouter()

    const id = params?.id as string | undefined
    const isEdit = !!id
    const [categories, setCategories] = useState<any[]>([])
    const [refs, setRefs] = useState<any[]>([])

    const getNumberValue = (value: string | number) =>
        typeof value === 'number' ? value : Number(value) || 0
    // 🔥 FETCH nếu là EDIT
    useEffect(() => {
        const fetchMeta = async () => {
            try {
                const [cateRes, refRes] = await Promise.all([
                    ProductService.getAllCategory(),
                    ProductService.getAllRef()
                ])

                setCategories(cateRes.data || [])
                setRefs(refRes.data || [])
            } catch (err) {
                console.error(err)
            }
        }

        fetchMeta()


        if (!isEdit) {
            setLoadingPage(false)
            return
        }

        const fetchProduct = async () => {
            try {
                const res = await ProductService.getProductById(id!)

                if (res.success && res.data) {
                    setFormData({
                        ...res.data,
                        price: getNumberValue(res.data.price),
                        stockQuantity: getNumberValue(res.data.stockQuantity),
                        height: getNumberValue(res.data.height),
                        length: getNumberValue(res.data.length),
                        width: getNumberValue(res.data.width),
                        weight: getNumberValue(res.data.weight),
                        regionSupported: res.data.regionSupported || [],
                        installationSupported: res.data.installationSupported ?? false
                    })
                }
            } catch (err) {
                console.error(err)
                alert('Không load được sản phẩm')
            } finally {
                setLoadingPage(false)
            }
        }

        fetchProduct()
    }, [id, isEdit])

    // 📸 Upload
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            const imageUrl = await uploadImage(file)
            setFormData(prev => ({ ...prev, imageUrl }))
        } catch (err) {
            alert('Upload ảnh thất bại')
        }
    }

    // 🧠 Input
    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value, type } = e.target

        setFormData(prev => ({
            ...prev,
            [name]:
                type === 'checkbox'
                    ? (e.target as HTMLInputElement).checked
                    : [
                        'price',
                        'stockQuantity',
                        'height',
                        'width',
                        'length',
                        'weight'
                    ].includes(name)
                        ? Number(value) || 0
                        : value
        }))
    }

    // 🌍 Region
    const toggleRegion = (code: string) => {
        setFormData(prev => {
            const exists = prev.regionSupported.includes(code)

            return {
                ...prev,
                regionSupported: exists
                    ? prev.regionSupported.filter(r => r !== code)
                    : [...prev.regionSupported, code]
            }
        })
    }

    // ✅ Validate
    const validate = () => {
        const price = getNumberValue(formData.price)

        if (!formData.name.trim()) {
            alert('Nhập tên sản phẩm')
            return false
        }
        if (price <= 0) {
            alert('Giá phải > 0')
            return false
        }
        return true
    }

    // 🚀 Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return

        try {
            setLoadingSubmit(true)

            if (isEdit) {
                await ProductService.updateProduct(formData.productId, formData)
                alert('Cập nhật thành công!')
            } else {
                await ProductService.createProduct(formData)
                alert('Tạo sản phẩm thành công!')
                setFormData(initialState)
            }

            router.push('/vendor/products')
        } catch (err) {
            console.error(err)
            alert('Có lỗi xảy ra!')
        } finally {
            setLoadingSubmit(false)
        }
    }

    if (loadingPage) {
        return (
            <div className="flex min-h-screen">
                <VendorSidebar />
                <div className="flex items-center justify-center w-full">
                    Loading...
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <VendorSidebar />

            <div className="flex-1 p-6">
                {/* HEADER */}
                <div className="mb-6">
                    <Link
                        href="/vendor/products"
                        className="flex items-center gap-2 text-orange-600 mb-2"
                    >
                        <ArrowLeft size={18} /> Quay lại
                    </Link>

                    <h1 className="text-2xl font-bold">
                        {isEdit ? 'Chỉnh sửa sản phẩm' : 'Tạo sản phẩm'}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }} className="flex gap-6">

                    {/* ===== LEFT ===== */}
                    <div className="w-3/4 flex flex-col gap-6">

                        {/* BASIC */}
                        <div className="card">
                            <h2 className="text-lg font-semibold">Thông tin cơ bản</h2>

                            <div className="grid grid-cols-2 gap-4 mt-4">

                                {/* Name */}
                                <div className="form-group">
                                    <label className="label">Tên sản phẩm</label>
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="input"
                                    />
                                </div>

                                {/* Brand */}
                                <div className="form-group">
                                    <label className="label">Thương hiệu</label>
                                    <input
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleChange}
                                        className="input"
                                    />
                                </div>

                                {/* Category */}
                                <div className="form-group">
                                    <label className="label">Danh mục</label>
                                    <select
                                        name="categoryId"
                                        value={formData.categoryId}
                                        onChange={handleChange}
                                        className="input"
                                    >
                                        <option value="">-- Chọn danh mục --</option>
                                        {categories.map(c => (
                                            <option key={c.categoryId} value={c.categoryId}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Ref */}
                                {/* <div className="form-group">
                                    <label className="label">Sản phẩm tham chiếu</label>
                                    <select
                                        name="refId"
                                        value={formData.refId || ''}
                                        onChange={handleChange}
                                        className="input"
                                    >
                                        <option value="">-- Không chọn --</option>
                                        {refs.map(r => (
                                            <option key={r.id} value={r.id}>
                                                {r.name}
                                            </option>
                                        ))}
                                    </select>
                                </div> */}

                                {/* Price */}
                                <div className="form-group">
                                    <label className="label">Giá</label>
                                    <div className="input-group">
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            className="input has-unit"
                                        />
                                        <span className="unit">₫</span>
                                    </div>
                                </div>

                                {/* Stock */}
                                <div className="form-group">
                                    <label className="label">Tồn kho</label>
                                    <input
                                        type="number"
                                        name="stockQuantity"
                                        value={formData.stockQuantity}
                                        onChange={handleChange}
                                        className="input"
                                    />
                                </div>

                            </div>

                            {/* Description */}
                            <div className="form-group mt-4">
                                <label className="label">Mô tả sản phẩm</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="input"
                                />
                            </div>
                        </div>

                        {/* SIZE */}
                        <div className='grid grid-cols-2 gap-2'>
                            <div className="col-span-1 card">
                                <h2>Kích thước & cân nặng</h2>

                                <div className="grid grid-cols-4 gap-4 mt-4">

                                    {/* Height */}
                                    <div className="input-group">
                                        <input
                                            type="number"
                                            name="height"
                                            value={formData.height}
                                            onChange={handleChange}
                                            className="input has-unit"
                                            placeholder="Height"
                                        />
                                        <span className="unit">cm</span>
                                    </div>

                                    {/* Width */}
                                    <div className="input-group">
                                        <input
                                            type="number"
                                            name="width"
                                            value={formData.width}
                                            onChange={handleChange}
                                            className="input has-unit"
                                            placeholder="Width"
                                        />
                                        <span className="unit">cm</span>
                                    </div>

                                    {/* Length */}
                                    <div className="input-group">
                                        <input
                                            type="number"
                                            name="length"
                                            value={formData.length}
                                            onChange={handleChange}
                                            className="input has-unit"
                                            placeholder="Length"
                                        />
                                        <span className="unit">cm</span>
                                    </div>

                                    {/* Weight */}
                                    <div className="input-group">
                                        <input
                                            type="number"
                                            name="weight"
                                            value={formData.weight}
                                            onChange={handleChange}
                                            className="input has-unit"
                                            placeholder="Weight"
                                        />
                                        <span className="unit">g</span>
                                    </div>

                                </div>
                            </div>

                            <div className="col-span-1 card">
                                <h2>Thông số kỹ thuật</h2>
                                <textarea
                                    name="specifications"
                                    value={formData.specifications}
                                    onChange={handleChange}
                                    className="input mt-4"
                                />
                            </div>
                        </div>

                        {/* REGION */}
                        <div className="card">
                            <h2>Khu vực hỗ trợ</h2>

                            <div className="region-container mt-4">
                                {VIETNAM_PROVINCES.map(item => {
                                    const isActive = formData.regionSupported?.includes(item.value)

                                    return (
                                        <button
                                            key={item.value}
                                            type="button"
                                            onClick={() => toggleRegion(item.value)}
                                            className={`region-item ${isActive ? 'active' : ''}`}
                                        >
                                            {item.label}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>


                        {/* SPEC */}


                    </div>

                    {/* ===== RIGHT ===== */}
                    <div className="w-1/4 flex flex-col gap-6">

                        {/* IMAGE */}
                        <div className="card">
                            <h2>Hình ảnh</h2>

                            {formData.imageUrl && (
                                <img src={formData.imageUrl} className="preview" />
                            )}

                            <label className="upload mt-2">
                                <Upload />
                                {uploading ? 'Đang upload...' : 'Upload ảnh'}
                                <input type="file" hidden onChange={handleFileChange} />
                            </label>
                        </div>

                        {/* INSTALL */}
                        <div className="card flex items-center gap-3">
                            <input
                                type="checkbox"
                                name="installationSupported"
                                checked={formData.installationSupported}
                                onChange={handleChange}
                                className="checkbox"
                            />
                            <label className="label cursor-pointer">
                                Hỗ trợ lắp đặt
                            </label>
                        </div>

                        {/* ACTION */}
                        <div className="card">
                            <Button
                                type="submit"
                                disabled={loadingSubmit}
                                className="w-full bg-green-600"
                            >
                                {loadingSubmit
                                    ? isEdit
                                        ? 'Đang lưu...'
                                        : 'Đang tạo...'
                                    : isEdit
                                        ? 'Lưu thay đổi'
                                        : 'Tạo sản phẩm'}
                            </Button>
                        </div>

                    </div>

                </form>
            </div>



            {/* STYLE */}
            <style jsx>{`
      .card {
        background: white;
        padding: 20px;
        border-radius: 12px;
        border: 1px solid #eee;
      }

      .input {
        width: 100%;
        padding: 10px;
        border-radius: 8px;
        border: 1px solid #ddd;
      }

      .region-container {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .region-item {
        padding: 6px 12px;
        border-radius: 20px;
        border: 1px solid #ddd;
        cursor: pointer;
      }

      .region-item.active {
        background: orange;
        color: white;
        border: none;
      }

      .upload {
        display: flex;
        align-items: center;
        gap: 6px;

        padding: 10px 14px;
        border: 1px dashed #ccc;
        border-radius: 8px;
        text-align: center;

        cursor: pointer;
        font-size: 13px;
        color: #555;

        transition: all 0.2s;
      }

      .upload:hover {
        border-color: orange;
        background: #fff7ed;
      }

      .preview {
        width: 100%;
        margin-top: 10px;
        border-radius: 10px;
      }
        .input-group {
        position: relative;
      }

      .has-unit {
        padding-right: 40px;
      }

      .unit {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 13px;
        color: #888;
      }

      .checkbox {
        width: 25px;
        height: 25px;
        accent-color: #16a34a;
      }
    `}</style>
        </div>
    )
}
