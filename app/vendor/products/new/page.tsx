'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, HelpCircle, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VendorSidebar } from '@/components/vendor-sidebar'
import { useFirebaseUpload } from '@/hooks/useFirebaseUpload'
import { ProductService } from '@/hooks/product.service'
import { EquipmentService } from '@/hooks/equipment.service'
import { Supplement, SupplementService } from '@/hooks/supplement.service'
import { EquipmentType } from '@/utils/EquipmentType'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


type Product = {
    productId: string
    categoryId: string
    refId?: string
    name: string
    description: string
    imageUrl: string
    price: number | string
    stockQuantity: number | string
    brand: string
    specifications: string
    categoryType: string
    expiredDate: string
    height: number | string
    length: number | string
    width: number | string
    weight: number | string
    installationSupported: boolean
    regionSupported: string[]
    regionSupportedValidForInstallation: boolean
    expiredDateValidForSupplement: boolean
}

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
    categoryType: 'SUPPLEMENT',
    expiredDate: '', // Bắt đầu bằng rỗng để user tự chọn
    height: '',
    length: '',
    width: '',
    weight: '',
    installationSupported: false,
    regionSupported: [],
    regionSupportedValidForInstallation: true,
    expiredDateValidForSupplement: true
}

type RefItem = EquipmentType | Supplement
type RefOption = {
    id: string;
    name: string;
};

export default function ProductFormPage() {
    const [formData, setFormData] = useState<Product>(initialState)
    const [loadingPage, setLoadingPage] = useState(true)
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const [errors, setErrors] = useState<{ expiredDate?: string; regionSupported?: string }>({})
    const [selectedType, setSelectedType] = useState('');
    const [refList, setRefList] = useState<RefOption[]>([]);
    const { uploadImage, loading: uploading } = useFirebaseUpload()

    const params = useParams()
    const router = useRouter()
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Hàm chuyển hướng sang trang tạo Ticket kèm đúng định dạng UUID loại sự cố
    const handleRedirectToTicket = () => {
        setIsModalOpen(false)
        router.push('/vendor/ticket?ticketType=b1c2c26b-d24b-43f6-802c-a60b797af76c')
    }
    const id = params?.id as string | undefined
    const isEdit = !!id
    const [categories, setCategories] = useState<any[]>([])
    const [provinces, setProvinces] = useState<any[]>([])

    const handleCategoryTypeChange = async (event: any) => {
        const categoryType = event.target.value;
        setSelectedType(categoryType);

        try {
            let newRefs: RefOption[] = [];

            switch (categoryType) {
                case "equipment": {
                    const res = await EquipmentService.getAll();
                    newRefs = res.map((item) => ({
                        id: item.equipmentId,
                        name: item.name,
                    }));
                    break;
                }

                case "supplement": {
                    const res = await SupplementService.getAll();
                    newRefs = res.data.map((item) => ({
                        id: item.supplementId,
                        name: item.name,
                    }));
                    break;
                }

                default:
                    newRefs = [];
            }

            setRefList(newRefs);
        } catch (error) {
            console.error("Lỗi khi fetch dữ liệu:", error);
        }
    };

    useEffect(() => {
        const fetchRefs = async () => {
            try {
                let newRefs: RefOption[] = [];

                switch (formData.categoryType) {
                    case "EQUIPMENT": {
                        const res = await EquipmentService.getAll();
                        newRefs = res.map((item) => ({
                            id: item.equipmentId,
                            name: item.name,
                        }));
                        break;
                    }

                    case "SUPPLEMENT": {
                        const res = await SupplementService.getAll();
                        newRefs = res.data.map((item) => ({
                            id: item.supplementId,
                            name: item.name,
                        }));
                        break;
                    }
                }

                setRefList(newRefs);
            } catch (err) {
                console.error(err);
            }
        };

        fetchRefs();
    }, [formData.categoryType]);

    const toValue = (str: string) => {
        return str
            .normalize("NFD") // tách dấu
            .replace(/[\u0300-\u036f]/g, "") // xóa dấu
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D")
            .replace(/[^a-zA-Z0-9\s]/g, "") // bỏ ký tự đặc biệt (-,...)
            .replace(/\s+/g, "") // xóa khoảng trắng
            .toLowerCase();
    };

    const transformAndSort = (data: any[]) => {
        return data
            .map((item) => ({
                label: item.ProvinceName,
                value: toValue(item.ProvinceName),
                id: item.ProvinceID,
                code: item.Code,
            }))
            .sort((a, b) =>
                a.label.localeCompare(b.label, "vi", { sensitivity: "base" })
            );
    };

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const res = await ProductService.getProvinces()
                setProvinces(transformAndSort(res.data))
            }
            catch (err) {
                console.error('Failed to load provinces', err)
            }
        }
        fetchProvinces()
    }, [])

    const getNumberValue = (value: string | number) =>
        typeof value === 'number' ? value : Number(value) || 0

    useEffect(() => {
        const fetchMeta = async () => {
            try {
                const [cateRes, refRes] = await Promise.all([
                    ProductService.getAllCategory(),
                    ProductService.getAllRef()
                ])

                setCategories(cateRes.data || [])
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
                    let formattedDate = initialState.expiredDate
                    if (res.data.expiredDate) {
                        formattedDate = res.data.expiredDate.split('T')[0]
                    }

                    setFormData({
                        ...res.data,
                        price: getNumberValue(res.data.price),
                        stockQuantity: getNumberValue(res.data.stockQuantity),
                        height: getNumberValue(res.data.height),
                        length: getNumberValue(res.data.length),
                        width: getNumberValue(res.data.width),
                        weight: getNumberValue(res.data.weight),
                        expiredDate: formattedDate,
                        categoryType: res.data.categoryType || 'SUPPLEMENT',
                        regionSupported: res.data.regionSupported || [],
                        installationSupported: res.data.installationSupported ?? false,
                        regionSupportedValidForInstallation: res.data.regionSupportedValidForInstallation ?? true,
                        expiredDateValidForSupplement: res.data.expiredDateValidForSupplement ?? true
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

    // --- CÁC HÀM VALIDATE INLINE ---

    const validateExpiredDate = (dateString: string) => {
        if (!dateString) return 'Vui lòng chọn ngày hết hạn'
        const selectedDate = new Date(dateString)
        const minValidDate = new Date()
        minValidDate.setFullYear(minValidDate.getFullYear() + 1) // HSD phải > 1 năm từ bây giờ

        if (selectedDate <= minValidDate) {
            return 'Hạn sử dụng phải lớn hơn 1 năm kể từ hiện tại'
        }
        return undefined
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        if (name === 'expiredDate') {
            const errMsg = validateExpiredDate(value)
            setErrors(prev => ({ ...prev, expiredDate: errMsg }))
        }
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target

        setFormData(prev => {
            let finalValue: any = value

            if (type === 'checkbox') {
                finalValue = (e.target as HTMLInputElement).checked
            } else if (
                ['price', 'stockQuantity', 'height', 'width', 'length', 'weight'].includes(name)
            ) {
                finalValue = Number(value) || 0
            }

            const newData = { ...prev, [name]: finalValue }

            // Lập tức kiểm tra validate nếu user bật Hỗ trợ lắp đặt
            if (name === 'installationSupported') {
                if (finalValue && newData.regionSupported.length === 0) {
                    setErrors(errs => ({ ...errs, regionSupported: 'Vui lòng chọn ít nhất 1 khu vực hỗ trợ' }))
                } else {
                    setErrors(errs => ({ ...errs, regionSupported: undefined }))
                    if (!finalValue) {
                        newData.regionSupported = [] // Xóa danh sách nếu tắt chức năng
                    }
                }
            }

            // Valid inline cho date (nếu đổi bằng picker)
            if (name === 'expiredDate') {
                setErrors(errs => ({ ...errs, expiredDate: validateExpiredDate(finalValue) }))
            }

            return newData
        })
    }

    const toggleRegion = (code: string) => {
        setFormData(prev => {
            const exists = prev.regionSupported.includes(code)
            const newRegions = exists
                ? prev.regionSupported.filter(r => r !== code)
                : [...prev.regionSupported, code]

            // Cập nhật validation lỗi ngay lập tức
            if (prev.installationSupported && newRegions.length === 0) {
                setErrors(errs => ({ ...errs, regionSupported: 'Vui lòng chọn ít nhất 1 khu vực hỗ trợ' }))
            } else {
                setErrors(errs => ({ ...errs, regionSupported: undefined }))
            }

            return {
                ...prev,
                regionSupported: newRegions
            }
        })
    }

    const validateForm = () => {
        const price = getNumberValue(formData.price)
        let isValid = true
        const newErrors: typeof errors = {}

        if (!formData.name.trim()) {
            alert('Nhập tên sản phẩm')
            isValid = false
        }
        if (!formData.categoryId) {
            alert('Vui lòng chọn danh mục')
            isValid = false
        }
        if (price <= 0) {
            alert('Giá phải > 0')
            isValid = false
        }

        const dateErr = validateExpiredDate(formData.expiredDate)
        if (dateErr) {
            newErrors.expiredDate = dateErr
            isValid = false
        }

        if (formData.installationSupported && formData.regionSupported.length === 0) {
            newErrors.regionSupported = 'Vui lòng chọn ít nhất 1 khu vực hỗ trợ'
            isValid = false
        }

        setErrors(newErrors)

        return isValid
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) return

        try {
            setLoadingSubmit(true)

            const payload = {
                ...formData,
                price: Number(formData.price),
                stockQuantity: Number(formData.stockQuantity),
                height: Number(formData.height),
                length: Number(formData.length),
                width: Number(formData.width),
                weight: Number(formData.weight),
                expiredDate: formData.expiredDate ? new Date(formData.expiredDate).toISOString() : null
            }

            if (isEdit) {
                await ProductService.updateProduct(formData.productId, payload)
                alert('Cập nhật thành công!')
            } else {
                await ProductService.createProduct(payload)
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

                <form
                    onSubmit={handleSubmit}
                    onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                    className="flex gap-6"
                >
                    {/* ===== LEFT BODY ===== */}
                    <div className="w-3/4 flex flex-col gap-6">

                        {/* BASIC DETAILS */}
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

                                {/* Category Type */}
                                <div className="form-group">
                                    <label className="label">Loại danh mục</label>
                                    <select
                                        name="categoryType"
                                        value={formData.categoryType}
                                        onChange={(e) => {
                                            handleChange(e);
                                            handleCategoryTypeChange(e);
                                        }}
                                        className="input"
                                    >
                                        <option value="SUPPLEMENT">Thực phẩm chức năng</option>
                                        <option value="EQUIPMENT">Thiết bị tập</option>
                                    </select>
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

                                {/* Ref Product */}
                                <div className="form-group">
                                    <div className="flex items-center gap-1.5">
                                        <label className="label">Sản phẩm tham chiếu (Ref)</label>
                                        <TooltipProvider delayDuration={200}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsModalOpen(true)}
                                                        className="text-gray-400 hover:text-orange-500 transition-colors p-0.5 rounded-full hover:bg-gray-100"
                                                        aria-label="Yêu cầu hỗ trợ tạo sản phẩm"
                                                    >
                                                        <HelpCircle size={14} />
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent side="top" className="bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-md border-0">
                                                    Không tìm thấy sản phẩm? Click để yêu cầu Admin tạo mới
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                                            <AlertDialogContent className="rounded-xl max-w-sm border border-orange-100 bg-white p-6 shadow-xl animate-in fade-in-50 zoom-in-95">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                                                        Yêu cầu admin tạo sản phẩm mới?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription className="text-xs text-gray-500 leading-relaxed pt-1">
                                                        Hệ thống sẽ chuyển hướng bạn đến form tạo Ticket hỗ trợ. Vui lòng cung cấp đầy đủ thông tin chi tiết về sản phẩm mong muốn để Admin phê duyệt.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter className="gap-2 pt-3 flex sm:justify-end">
                                                    <AlertDialogCancel className="rounded-lg border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-semibold px-4 py-2">
                                                        Hủy bỏ
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={handleRedirectToTicket}
                                                        className="rounded-lg text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 shadow-sm px-4 py-2"
                                                    >
                                                        Đồng ý, chuyển hướng
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                    <select
                                        name="refId"
                                        value={formData.refId || ''}
                                        onChange={handleChange}
                                        className="input"
                                    >
                                        <option value="">-- Không chọn --</option>
                                        {refList.map((r) => (
                                            <option key={r.id} value={r.id}>
                                                {r.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

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

                                {/* Expired Date */}
                                <div className="form-group">
                                    <label className="label">Ngày hết hạn (Expired Date)</label>
                                    <input
                                        type="date"
                                        name="expiredDate"
                                        value={formData.expiredDate}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`input ${errors.expiredDate ? 'border-red-500 bg-red-50' : ''}`}
                                    />
                                    {errors.expiredDate && (
                                        <span className="text-red-500 text-xs mt-1">{errors.expiredDate}</span>
                                    )}
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

                        {/* SUPPORTED REGIONS / INSTALLATION */}
                        <div className="card">
                            <h2 className="text-lg font-semibold">Hỗ trợ lắp đặt & Vận chuyển</h2>

                            <div className="flex items-center gap-3 mt-4 mb-2">
                                <input
                                    type="checkbox"
                                    name="installationSupported"
                                    id="installationSupported"
                                    checked={formData.installationSupported}
                                    onChange={handleChange}
                                    className="checkbox"
                                />
                                <label htmlFor="installationSupported" className="label text-sm cursor-pointer select-none mb-0">
                                    Sản phẩm có hỗ trợ lắp đặt (Thiết bị)
                                </label>
                            </div>

                            {/* Conditional Rendering của Region */}
                            {formData.installationSupported && (
                                <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                                    <label className="label font-semibold">Chọn khu vực hỗ trợ:</label>
                                    {errors.regionSupported && (
                                        <p className="text-red-500 text-xs mb-2">{errors.regionSupported}</p>
                                    )}
                                    <div className="region-container mt-2">
                                        {provinces.map(item => {
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
                            )}
                        </div>

                        {/* PACKAGING SIZE & TECH SPECS */}
                        <div className='grid grid-cols-2 gap-4'>
                            <div className="card">
                                <h2 className="text-lg font-semibold">Kích thước đóng gói & Cân nặng</h2>

                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div className="form-group">
                                        <label className="text-xs text-gray-500 mb-1">Chiều cao</label>
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
                                    </div>

                                    <div className="form-group">
                                        <label className="text-xs text-gray-500 mb-1">Chiều rộng</label>
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
                                    </div>

                                    <div className="form-group">
                                        <label className="text-xs text-gray-500 mb-1">Chiều dài</label>
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
                                    </div>

                                    <div className="form-group">
                                        <label className="text-xs text-gray-500 mb-1">Trọng lượng</label>
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
                            </div>

                            <div className="card">
                                <h2 className="text-lg font-semibold">Thông số kỹ thuật</h2>
                                <textarea
                                    name="specifications"
                                    value={formData.specifications}
                                    onChange={handleChange}
                                    className="input mt-4 h-28.75"
                                    placeholder="Ví dụ: 180cm x 60cm, 6mm thickness"
                                />
                            </div>
                        </div>

                    </div>

                    {/* ===== RIGHT SIDEBAR ===== */}
                    <div className="w-1/4 flex flex-col gap-6">

                        {/* IMAGE UPLOAD */}
                        <div className="card">
                            <h2 className="text-lg font-semibold mb-2">Hình ảnh sản phẩm</h2>

                            {formData.imageUrl && (
                                <img src={formData.imageUrl} alt="Preview" className="preview mb-2" />
                            )}

                            <label className="upload">
                                <Upload size={16} />
                                {uploading ? 'Đang upload...' : 'Upload ảnh'}
                                <input type="file" hidden onChange={handleFileChange} />
                            </label>
                        </div>

                        {/* ACTION BUTTON */}
                        <div className="card">
                            <Button
                                type="submit"
                                disabled={loadingSubmit || uploading}
                                className="w-full bg-green-600 hover:bg-green-700 text-white"
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

            {/* STYLES */}
            <style jsx>{`
                    .card {
                        background: white;
                        padding: 20px;
                        border-radius: 12px;
                        border: 1px solid #eee;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                    }
                    .label {
                        display: block;
                        font-size: 14px;
                        font-weight: 500;
                        margin-bottom: 6px;
                        color: #333;
                    }
                    .input {
                        width: 100%;
                        padding: 10px;
                        border-radius: 8px;
                        border: 1px solid #ddd;
                        font-size: 14px;
                        background-color: #fff;
                        transition: all 0.2s;
                    }
                    .input:focus {
                        outline: none;
                        border-color: orange;
                    }
                    .region-container {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 8px;
                    }
                    .region-item {
                        padding: 6px 14px;
                        border-radius: 20px;
                        border: 1px solid #ddd;
                        cursor: pointer;
                        font-size: 13px;
                        background: #fff;
                        transition: all 0.2s;
                    }
                    .region-item:hover {
                        border-color: orange;
                    }
                    .region-item.active {
                        background: orange;
                        color: white;
                        border-color: orange;
                    }
                    .upload {
                        display: flex;
                        align-items: center;
                        justify-content: center;
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
                        color: orange;
                    }
                    .preview {
                        width: 100%;
                        max-height: 200px;
                        object-fit: cover;
                        border-radius: 10px;
                        border: 1px solid #eee;
                    }
                    .input-group {
                        position: relative;
                    }
                    .has-unit {
                        padding-right: 40px;
                    }
                    .unit {
                        position: absolute;
                        right: 12px;
                        top: 50%;
                        transform: translateY(-50%);
                        font-size: 13px;
                        color: #888;
                    }
                    .checkbox {
                        width: 20px;
                        height: 20px;
                        accent-color: #16a34a;
                        cursor: pointer;
                    }
                    .form-group {
                        display: flex;
                        flex-direction: column;
                    }
                `}</style>
        </div>
    )
}