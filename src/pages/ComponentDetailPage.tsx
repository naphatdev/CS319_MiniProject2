import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Bot, Check, Clipboard, Code2, Heart, Sparkles } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { FeedbackToast } from '../components/common/FeedbackToast'
import { ErrorState } from '../components/common/States'
import { PreviewFrame } from '../components/preview/PreviewFrame'
import { useComponent } from '../hooks/useComponents'
import { useFavoritesStore } from '../stores/useFavoritesStore'
import { copyText } from '../utils/preview'

type CodeTab = 'HTML' | 'CSS' | 'Tailwind CSS'

export function ComponentDetailPage() {
  const { id = '' } = useParams()
  const { data: component, isLoading, isError, refetch } = useComponent(id)
  const [activeTab, setActiveTab] = useState<CodeTab>('HTML')
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ message: string; type?: 'success' | 'error' } | null>(null)
  const isFavorite = useFavoritesStore((state) => state.favoriteIds.includes(id))
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite)

  useEffect(() => {
    if (!feedback) return
    const timeout = window.setTimeout(() => setFeedback(null), 2400)
    return () => window.clearTimeout(timeout)
  }, [feedback])

  useEffect(() => setSelectedColor(null), [id])

  const adjustedComponent = useMemo(() => {
    if (!component) return null
    const activeColor = selectedColor ?? component.accent
    const accentPattern = new RegExp(component.accent, 'gi')
    return { ...component, accent: activeColor, cssCode: component.cssCode.replace(accentPattern, activeColor) }
  }, [component, selectedColor])

  const paletteColors = useMemo(() => {
    if (!component) return []
    return Array.from(new Set([component.accent, '#2563eb', '#ec4899', '#14b8a6']))
  }, [component])

  const code = useMemo(() => {
    if (!adjustedComponent) return ''
    if (activeTab === 'CSS') return adjustedComponent.cssCode
    if (activeTab === 'Tailwind CSS') return adjustedComponent.tailwindCode
    return adjustedComponent.htmlCode
  }, [activeTab, adjustedComponent])

  async function handleCopy(text: string, successMessage: string) {
    try {
      await copyText(text)
      setFeedback({ message: successMessage })
    } catch {
      setFeedback({ message: 'คัดลอกไม่สำเร็จ กรุณาลองอีกครั้ง', type: 'error' })
    }
  }

  if (isLoading) return <div className="container detail-loading"><div className="detail-skeleton"><div /><span /><span /></div></div>
  if (isError || !component || !adjustedComponent) return <div className="container page-section"><ErrorState message="ไม่พบคอมโพเนนต์นี้" onRetry={() => void refetch()} /></div>

  return <div className="page-section detail-page">
    {feedback && <FeedbackToast message={feedback.message} type={feedback.type} />}
    <div className="container">
      <Link to="/" className="back-link"><ArrowLeft size={18} /> กลับไปเลือกแบบอื่น</Link>

      <div className="detail-heading">
        <div><span className="category-label">{component.category}</span><h1>{component.name}</h1><p>{component.description}</p></div>
        <button className={`button ${isFavorite ? 'soft' : 'outline'}`} onClick={() => toggleFavorite(component.id)}><Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />{isFavorite ? 'บันทึกแล้ว' : 'บันทึก'}</button>
      </div>

      <div className="detail-grid">
        <section className="preview-panel">
          <div className="panel-heading"><div><Sparkles size={18} /><h2>ตัวอย่างจริง</h2></div><span>Interactive Preview</span></div>
          <PreviewFrame component={adjustedComponent} className="detail-preview-frame" />
        </section>

        <aside className="customize-panel">
          <div className="panel-heading"><div><Code2 size={18} /><h2>ข้อมูลตัวอย่าง</h2></div></div>
          <dl><div><dt>หมวดหมู่</dt><dd>{component.category}</dd></div><div><dt>รูปแบบโค้ด</dt><dd>{component.framework}</dd></div><div><dt>เหมาะสำหรับ</dt><dd>ผู้เริ่มต้น</dd></div></dl>
          <div className="palette-label">เลือกโทนสี</div>
          <div className="palette">{paletteColors.map((color) => <button key={color} className={(selectedColor ?? component.accent) === color ? 'active' : ''} style={{ background: color }} onClick={() => setSelectedColor(color)} aria-label={`เปลี่ยนโทนสีเป็น ${color}`} aria-pressed={(selectedColor ?? component.accent) === color} />)}</div>
          <div className="tip-box"><Sparkles size={17} /><p><strong>ลองปรับแต่ง</strong><br />คัดลอกโค้ดด้านล่าง แล้วนำไปลองแก้ใน Playground ได้เลย</p></div>
          <Link to="/playground" state={{ html: adjustedComponent.htmlCode, css: adjustedComponent.cssCode, name: adjustedComponent.name }} className="button primary full">เปิด UI นี้ใน Playground</Link>
        </aside>
      </div>

      <section className="code-panel">
        <div className="code-tabs">
          <div>{(['HTML', 'CSS', 'Tailwind CSS'] as CodeTab[]).map((tab) => <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>{tab}</button>)}</div>
          <button className="copy-code-button" onClick={() => void handleCopy(code, `คัดลอก ${activeTab} แล้ว`)}><Clipboard size={17} />คัดลอกโค้ด</button>
        </div>
        <pre><code>{code}</code></pre>
      </section>

      <section className="ai-helper">
        <div className="ai-helper-icon"><Bot size={28} /></div>
        <div><span className="section-kicker">AI Reference</span><h2>นำแบบนี้ไปให้ AI ช่วยสร้างเว็บ</h2><p>แคปภาพตัวอย่าง แล้วคัดลอกคำอธิบายนี้ไปพร้อมกัน AI จะเข้าใจสิ่งที่คุณต้องการชัดขึ้น</p><blockquote>{component.aiPrompt}</blockquote></div>
        <button className="button primary" onClick={() => void handleCopy(component.aiPrompt, 'คัดลอก Prompt สำหรับ AI แล้ว')}><Check size={17} />คัดลอก Prompt</button>
      </section>
    </div>
  </div>
}
