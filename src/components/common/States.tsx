import { AlertTriangle, Inbox, RefreshCw } from 'lucide-react'

export function LoadingGrid({ count = 6 }: { count?: number }) {
  return <div className="component-grid" aria-label="กำลังโหลด">
    {Array.from({ length: count }, (_, index) => <div className="skeleton-card" key={index}><div /><span /><span /></div>)}
  </div>
}

export function ErrorState({ onRetry, message = 'เกิดปัญหาในการโหลดข้อมูล' }: { onRetry: () => void; message?: string }) {
  return <div className="state-card"><AlertTriangle size={44} /><h2>{message}</h2><p>กรุณาตรวจสอบว่า Mock API กำลังทำงาน แล้วลองอีกครั้ง</p><button className="button primary" onClick={onRetry}><RefreshCw size={17} />ลองใหม่</button></div>
}

export function EmptyState({ title = 'ยังไม่พบรายการ', description = 'ลองเปลี่ยนคำค้นหาหรือตัวกรองดูอีกครั้ง' }: { title?: string; description?: string }) {
  return <div className="state-card"><Inbox size={48} /><h2>{title}</h2><p>{description}</p></div>
}
