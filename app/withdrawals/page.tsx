'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search, Filter, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { WalletService } from '@/hooks/wallet.service'

interface WithdrawalRequest {
    walletWithdrawalId: string
    accountId: string
    recipientName: string
    bankAccountNumber: string
    bankCode: string
    bankName: string
    bankLogo: string
    amount: number
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED'
    note: string
    adminNote: string | null
    processedBy: string | null
    requestedAt: string
    processedAt: string | null
    completedAt: string | null
    updatedAt: string | null
}

const mockData: WithdrawalRequest[] = [
    {
        walletWithdrawalId: 'e28afde8-9467-4395-a011-a0da916af333',
        accountId: '96c3c3ca-bafa-4deb-bf7d-cf1f1055b681',
        recipientName: 'ntp chu ai',
        bankAccountNumber: '1021950955',
        bankCode: 'bidv',
        bankName: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam',
        bankLogo: 'https://example.com/logo.png',
        amount: 1000000,
        status: 'PENDING',
        note: 'abc def',
        adminNote: null,
        processedBy: null,
        requestedAt: '2026-03-17T20:23:51.479371Z',
        processedAt: null,
        completedAt: null,
        updatedAt: null,
    },
    {
        walletWithdrawalId: 'e8eea78b-bda5-4636-9912-fa396d757e70',
        accountId: '96c3c3ca-bafa-4deb-bf7d-cf1f1055b681',
        recipientName: 'Nguyen Van A',
        bankAccountNumber: '1234567890',
        bankCode: 'bidv',
        bankName: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam',
        bankLogo: 'https://example.com/logo.png',
        amount: 1000000,
        status: 'COMPLETED',
        note: 'Urgent withdrawal',
        adminNote: 'Approved - Processing transfer',
        processedBy: '77bbefa5-6173-4f45-86dd-2e6e98940a94',
        requestedAt: '2026-03-14T00:25:40.294590Z',
        processedAt: '2026-03-14T00:27:47.253444Z',
        completedAt: '2026-03-14T00:28:00.558462Z',
        updatedAt: '2026-03-14T00:28:00.608373Z',
    },
    {
        walletWithdrawalId: '8aa55110-273c-4a6e-8d3c-4f35eefac587',
        accountId: '96c3c3ca-bafa-4deb-bf7d-cf1f1055b681',
        recipientName: 'ntp chu ai',
        bankAccountNumber: '1021950952',
        bankCode: 'vcb',
        bankName: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam',
        bankLogo: 'https://example.com/logo.png',
        amount: 100000,
        status: 'PENDING',
        note: 'tui mun rut tien',
        adminNote: null,
        processedBy: null,
        requestedAt: '2026-03-13T21:40:48.793428Z',
        processedAt: null,
        completedAt: null,
        updatedAt: null,
    },
]

function getStatusBadge(status: string) {
    switch (status) {
        case 'PENDING':
            return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">Chờ xử lý</span>
        case 'COMPLETED':
            return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Hoàn tất</span>
        case 'CANCELLED':
            return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">Đã hủy</span>
        default:
            return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">{status}</span>
    }
}

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount)
}

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    })
}

export default function WithdrawalsPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('ALL')
    const [data, setData] = useState<WithdrawalRequest[]>([])
    const [loading, setLoading] = useState(true)
    const filteredData = data.filter((item) => {
        const matchesSearch =
            item.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.bankAccountNumber.includes(searchTerm) ||
            item.walletWithdrawalId.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const stats = {
        pending: data.filter((d) => d.status === 'PENDING').length,
        completed: data.filter((d) => d.status === 'COMPLETED').length,
        cancelled: data.filter((d) => d.status === 'CANCELLED').length,
        totalAmount: data.reduce((sum, d) => sum + d.amount, 0),
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await WalletService.getAllRequest()

                if (res.success) {
                    setData(res.data || [])
                } else {
                    console.error(res.message)
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])
    return (
        <div className="min-h-screen bg-orange-50 flex">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header title="Yêu Cầu Rút Tiền" />

                <div className="flex-1 overflow-auto p-6">
                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg border border-orange-200 p-4">
                            <div className="text-sm text-gray-600">Chờ xử lý</div>
                            <div className="text-2xl font-bold text-orange-600 mt-2">{stats.pending}</div>
                        </div>
                        <div className="bg-white rounded-lg border border-orange-200 p-4">
                            <div className="text-sm text-gray-600">Hoàn tất</div>
                            <div className="text-2xl font-bold text-green-600 mt-2">{stats.completed}</div>
                        </div>
                        <div className="bg-white rounded-lg border border-orange-200 p-4">
                            <div className="text-sm text-gray-600">Đã hủy</div>
                            <div className="text-2xl font-bold text-red-600 mt-2">{stats.cancelled}</div>
                        </div>
                        <div className="bg-white rounded-lg border border-orange-200 p-4">
                            <div className="text-sm text-gray-600">Tổng tiền</div>
                            <div className="text-2xl font-bold text-blue-600 mt-2">{formatCurrency(stats.totalAmount)}</div>
                        </div>
                    </div>

                    {/* Table Card */}
                    <div className="bg-white rounded-lg border border-orange-200 overflow-hidden shadow-sm">
                        {/* Header with Filters */}
                        <div className="border-b border-orange-200 p-6">
                            <div className="flex items-center gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm theo tên, số tài khoản hoặc ID..."
                                        className="w-full pl-10 pr-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="ALL">Tất cả trạng thái</option>
                                    <option value="PENDING">Chờ xử lý</option>
                                    <option value="COMPLETED">Hoàn tất</option>
                                    <option value="CANCELLED">Đã hủy</option>
                                </select>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-orange-50 border-b border-orange-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-orange-700">Mã Yêu Cầu</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-orange-700">Tên Người Nhận</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-orange-700">Ngân Hàng</th>
                                        <th className="px-6 py-3 text-right text-sm font-semibold text-orange-700">Số Tiền</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-orange-700">Trạng Thái</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-orange-700">Ngày Yêu Cầu</th>
                                        <th className="px-6 py-3 text-center text-sm font-semibold text-orange-700">Hành Động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((item, index) => (
                                        <tr key={index} className="border-b border-orange-100 hover:bg-orange-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-mono text-gray-600">{item.walletWithdrawalId.substring(0, 8)}...</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 font-medium">{item.recipientName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{item.bankName}</td>
                                            <td className="px-6 py-4 text-sm text-right font-semibold text-gray-800">{formatCurrency(item.amount)}</td>
                                            <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{formatDate(item.requestedAt)}</td>
                                            <td className="px-6 py-4 text-center">
                                                <Link href={`/withdrawals/${item.walletWithdrawalId}`}>
                                                    <Button variant="outline" size="sm" className="border-orange-300 text-orange-600 hover:bg-orange-50">
                                                        <Eye size={16} className="mr-2" />
                                                        Chi Tiết
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Empty State */}
                        {filteredData.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-lg">Không tìm thấy yêu cầu rút tiền nào</div>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {filteredData.length > 0 && (
                        <div className="mt-6 flex items-center justify-center gap-2">
                            <Button variant="outline" size="sm" className="border-orange-300">
                                &larr; Trước
                            </Button>
                            <span className="text-sm text-gray-600">1 / 2</span>
                            <Button variant="outline" size="sm" className="border-orange-300">
                                Sau &rarr;
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
