import { Home } from 'lucide-react'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return <div className="not-found"><div><span>404</span><h1>หลงทางนิดหน่อย</h1><p>หน้าที่คุณกำลังมองหาอาจถูกย้าย หรือไม่มีอยู่แล้ว</p><Link to="/" className="button primary"><Home size={17} />กลับหน้าหลัก</Link></div></div>
}
