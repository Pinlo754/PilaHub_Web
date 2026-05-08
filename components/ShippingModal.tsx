// components/shipping-modal.tsx
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface ShippingModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (payload: any) => void
}
const REQUIRE_NOTE_LABEL: Record<string, string> = {
    CHOTHUHANG: 'Cho thử hàng',
    CHOXEMHANGKHONGTHU: 'Cho xem hàng, không cho thử',
    KHONGCHOXEMHANG: 'Không cho xem hàng'
}

export function ShippingModal({ isOpen, onClose, onConfirm }: ShippingModalProps) {
    const [provider, setProvider] = useState<'GHN' | 'SELF'>('GHN')
    const [note, setNote] = useState('')
    const [requireNote, setRequireNote] = useState<'CHOTHUHANG' | 'CHOXEMHANGKHONGTHU' | 'KHONGCHOXEMHANG'>('CHOTHUHANG')
    const [ghnNote, setGhnNote] = useState('')
    const handleConfirm = () => {
        const payload = {
            shippingProvider: provider,

            ...(provider === 'SELF' && {
                selfRequest: {
                    trackingNumber: `SELF-TRACK-${Date.now()}`,
                    ...(note && { note })
                }
            }),

            ...(provider === 'GHN' && {
                ghnRequest: {
                    requireNote: requireNote, // ví dụ: 'CHOXEMHANGKHONGTHU'
                    note: ghnNote
                }
            })
        }

        onConfirm(payload)
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Chọn phương thức vận chuyển</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Nhà vận chuyển</Label>
                        <Select value={provider} onValueChange={(v: any) => setProvider(v)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="GHN">Giao Hàng Nhanh (GHN)</SelectItem>
                                <SelectItem value="SELF">Tự vận chuyển (SELF)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {provider === 'SELF' && (
                        <div className="space-y-2">
                            <Label>Ghi chú</Label>
                            <Input
                                placeholder="Nhập ghi chú đơn hàng..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </div>
                    )}

                    {provider === 'GHN' && (
                        <div className="space-y-2">
                            <Label>Yêu cầu giao hàng</Label>
                            <Select value={requireNote} onValueChange={(v) => setRequireNote(v as typeof requireNote)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn yêu cầu giao hàng" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CHOTHUHANG">Cho thử hàng</SelectItem>
                                    <SelectItem value="CHOXEMHANGKHONGTHU">Cho xem hàng, không cho thử</SelectItem>
                                    <SelectItem value="KHONGCHOXEMHANG">Không cho xem hàng</SelectItem>
                                </SelectContent>
                            </Select>
                            <Label>Ghi chú GHN</Label>
                            <Input
                                placeholder="Nhập ghi chú cho GHN..."
                                value={ghnNote}
                                onChange={(e) => setGhnNote(e.target.value)}
                            />
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Hủy</Button>
                    <Button onClick={handleConfirm}>Xác nhận bàn giao</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}