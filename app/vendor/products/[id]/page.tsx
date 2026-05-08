'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Edit2, Package, Info, Tag, Truck, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VendorSidebar } from '@/components/vendor-sidebar'
import { ProductService } from '@/hooks/product.service'

const mockProduct = {
    productId: "123e4567-e89b-12d3-a456-426614174000",
    name: "Professional Pilates Mat",
    description: "Mô tả sản phẩm chất lượng cao...",
    imageUrl: "https://via.placeholder.com/400x300",
    price: 599000,
    stockQuantity: 100,
    brand: "MatPro",
    specifications: "180cm x 60cm, 6mm thickness",
    categoryType: "EQUIPMENT",
    categoryName: "Thiết bị tập",
    height: 15,
    length: 180,
    width: 60,
    weight: 1200,
    expiredDate: null,
    installationSupported: true,
    regionSupported: ["hochiminh", "hanoi"],
    active: true,
    createdAt: "2026-01-23T10:30:00Z"
}

export default function ProductDetailPage() {
    const params = useParams()
    const id = params?.id as string
    const [product, setProduct] = useState<any>(mockProduct)
    const [provinces, setProvinces] = useState<any[]>([])

    // Helper map tên tỉnh giống trang New
    const toValue = (str: string) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D")
            .replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "").toLowerCase();
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                // Load provinces
                const provRes = await ProductService.getProvinces()
                setProvinces(provRes.data.map((p: any) => ({ label: p.ProvinceName, value: toValue(p.ProvinceName) })))
                
                // Load product
                if (id) {
                    const res = await ProductService.getProductById(id)
                    if (res.success) setProduct(res.data)
                }
            } catch (err) {
                console.error(err)
            }
        }
        loadData()
    }, [id])

    return (
        <div className="flex min-h-screen bg-[#fdfaf7]">
            <VendorSidebar />
            <div className="flex-1 p-8">
                {/* Header */}
                <div className="max-w-5xl mx-auto mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/vendor/products">
                            <Button variant="ghost" className="rounded-full w-10 h-10 p-0 hover:bg-orange-100">
                                <ArrowLeft className="text-orange-600" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Chi tiết sản phẩm</h1>
                            <p className="text-gray-500 text-sm">ID: {product.productId}</p>
                        </div>
                    </div>
                    <Link href={`/vendor/products/${id}/edit`}>
                        <Button className="bg-orange-500 hover:bg-orange-600 text-white gap-2">
                            <Edit2 size={18} /> Chỉnh sửa
                        </Button>
                    </Link>
                </div>

                <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cột trái: Thông tin chính */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Section 1: Thông tin cơ bản */}
                        <div className="form-card">
                            <h2 className="section-title"><Info size={20} /> Thông tin cơ bản</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="detail-label">Tên sản phẩm</label>
                                    <div className="detail-value text-lg font-semibold">{product.name}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="detail-label">Thương hiệu</label>
                                        <div className="detail-value">{product.brand}</div>
                                    </div>
                                    <div>
                                        <label className="detail-label">Trạng thái</label>
                                        <div className={`detail-value font-medium ${product.active ? 'text-green-600' : 'text-red-500'}`}>
                                            {product.active ? '● Đang kinh doanh' : '● Ngừng kinh doanh'}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="detail-label">Mô tả sản phẩm</label>
                                    <div className="detail-value whitespace-pre-wrap leading-relaxed">{product.description}</div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Thông số kỹ thuật */}
                        <div className="form-card">
                            <h2 className="section-title"><Tag size={20} /> Thông số kỹ thuật</h2>
                            <div className="detail-value bg-gray-50 p-4 border-dashed border-2 border-gray-200">
                                {product.specifications || "Chưa có thông số"}
                            </div>
                        </div>

                        {/* Section 3: Giá và Kho */}
                        <div className="form-card">
                            <h2 className="section-title"><Package size={20} /> Thông tin chi tiết & Giá</h2>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="detail-label">Giá bán</label>
                                    <div className="detail-value text-green-600 font-bold text-xl">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                    </div>
                                </div>
                                <div>
                                    <label className="detail-label">Số lượng tồn kho</label>
                                    <div className="detail-value font-bold text-lg">{product.stockQuantity}</div>
                                </div>
                                <div>
                                    <label className="detail-label">Loại sản phẩm</label>
                                    <div className="detail-value">{product.categoryType === 'SUPPLEMENT' ? 'Thực phẩm chức năng' : 'Thiết bị tập'}</div>
                                </div>
                                <div>
                                    <label className="detail-label">Danh mục cụ thể</label>
                                    <div className="detail-value">{product.categoryName}</div>
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Đặc điểm riêng */}
                        <div className="form-card">
                            <h2 className="section-title">
                                {product.categoryType === 'SUPPLEMENT' ? <Calendar size={20} /> : <Truck size={20} />} 
                                Đặc điểm loại sản phẩm
                            </h2>
                            {product.categoryType === 'SUPPLEMENT' ? (
                                <div>
                                    <label className="detail-label">Hạn sử dụng</label>
                                    <div className="detail-value">
                                        {product.expiredDate ? new Date(product.expiredDate).toLocaleDateString('vi-VN') : 'Không có thông tin'}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="detail-label">Kích thước (D x R x C)</label>
                                            <div className="detail-value">{product.length} x {product.width} x {product.height} cm</div>
                                        </div>
                                        <div>
                                            <label className="detail-label">Trọng lượng</label>
                                            <div className="detail-value">{product.weight} g</div>
                                        </div>
                                    </div>
                                    {product.installationSupported && (
                                        <div>
                                            <label className="detail-label">Khu vực hỗ trợ lắp đặt</label>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {product.regionSupported?.map((r: string) => (
                                                    <span key={r} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-md text-sm border border-orange-200">
                                                        ✓ {provinces.find(p => p.value === r)?.label || r}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Cột phải: Hình ảnh & Phụ */}
                    <div className="space-y-6">
                        <div className="form-card">
                            <h2 className="section-title">Hình ảnh sản phẩm</h2>
                            <div className="aspect-square rounded-xl overflow-hidden border border-gray-100 shadow-inner bg-gray-50">
                                <img 
                                    src={product.imageUrl} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        
                    </div>
                </div>
            </div>

            <style jsx>{`
                .form-card {
                    background: white;
                    padding: 24px;
                    border-radius: 16px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.03);
                    border: 1px solid #f1f1f1;
                }
                .section-title {
                    font-size: 18px;
                    font-weight: 700;
                    color: #333;
                    margin-bottom: 20px;
                    padding-bottom: 12px;
                    border-bottom: 2px solid #fff7ed;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .detail-label {
                    display: block;
                    font-size: 13px;
                    font-weight: 600;
                    color: #f97316;
                    text-transform: uppercase;
                    margin-bottom: 4px;
                    letter-spacing: 0.5px;
                }
                .detail-value {
                    color: #374151;
                    padding: 8px 0;
                    border-bottom: 1px solid #f9fafb;
                }
            `}</style>
        </div>
    )
}