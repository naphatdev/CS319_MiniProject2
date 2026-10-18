import { useEffect, useState } from 'react'
import { Clipboard, Code2, Lightbulb, Play, RotateCcw, Sparkles } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { FeedbackToast } from '../components/common/FeedbackToast'
import { copyText } from '../utils/preview'

const starterHtml = `<div class="card">
  <div class="icon">✦</div>
  <h2>ตัวอย่างการ์ด</h2>
  <p>นี่คือส่วนประกอบที่คุณสามารถปรับแต่งได้ตามต้องการ</p>
  <button>ดูเพิ่มเติม</button>
</div>`

const starterCss = `.card {
  width: min(340px, 90%);
  padding: 32px;
  border-radius: 24px;
  background: white;
  box-shadow: 0 20px 55px rgba(76, 29, 149, .14);
  text-align: center;
  font-family: Arial, sans-serif;
  color: #1e1b4b;
}
.icon {
  width: 54px; height: 54px; margin: 0 auto 16px;
  display: grid; place-items: center; border-radius: 16px;
  background: #ede9fe; color: #7c3aed; font-size: 24px;
}
.card h2 { margin: 0 0 10px; }
.card p { color: #64748b; line-height: 1.6; }
.card button {
  border: 0; border-radius: 12px; padding: 12px 22px;
  color: white; background: linear-gradient(135deg,#7c3aed,#d946ef);
  cursor: pointer;
}`

const samples = {
  'การ์ดแนะนำ': { html: starterHtml, css: starterCss },
  'ปุ่มไล่สี': {
    html: `<button class="gradient-button">เริ่มต้นใช้งาน <span>→</span></button>`,
    css: `.gradient-button { border:0; padding:16px 30px; border-radius:999px; color:white; font:600 16px Arial; background:linear-gradient(90deg,#7c3aed,#d946ef); box-shadow:0 12px 28px rgba(124,58,237,.32); cursor:pointer; transition:.25s; } .gradient-button:hover { transform:translateY(-3px); box-shadow:0 16px 32px rgba(124,58,237,.4); } .gradient-button span { margin-left:10px; }`,
  },
  'แจ้งเตือนสำเร็จ': {
    html: `<div class="toast"><span>✓</span><div><strong>สำเร็จ!</strong><small>บันทึกการเปลี่ยนแปลงแล้ว</small></div></div>`,
    css: `.toast { display:flex; align-items:center; gap:14px; padding:16px 22px; border-radius:14px; background:#065f46; color:white; font-family:Arial; box-shadow:0 12px 30px rgba(6,95,70,.25); } .toast>span { display:grid; place-items:center; width:32px; height:32px; border-radius:50%; background:#10b981; } .toast strong,.toast small { display:block; } .toast small { margin-top:4px; color:#a7f3d0; }`,
  },
}

function documentFor(html: string, css: string) {
  return `<!doctype html><html><head><meta charset="UTF-8"><style>*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:28px;background:#f8f9fd}${css}</style></head><body>${html}</body></html>`
}

interface PlaygroundRouteState {
  html?: string
  css?: string
  name?: string
}

export function PlaygroundPage() {
  const routeState = useLocation().state as PlaygroundRouteState | null
  const [html, setHtml] = useState(() => routeState?.html ?? starterHtml)
  const [css, setCss] = useState(() => routeState?.css ?? starterCss)
  const [activeEditor, setActiveEditor] = useState<'HTML' | 'CSS'>('HTML')
  const [feedback, setFeedback] = useState<string | null>(() => routeState?.name ? `เปิด ${routeState.name} ใน Playground แล้ว` : null)

  useEffect(() => {
    if (!feedback) return
    const timer = window.setTimeout(() => setFeedback(null), 2000)
    return () => window.clearTimeout(timer)
  }, [feedback])

  async function handleCopy(value: string, label: string) {
    try { await copyText(value); setFeedback(`คัดลอก ${label} แล้ว`) } catch { setFeedback('คัดลอกไม่สำเร็จ') }
  }

  function loadSample(name: keyof typeof samples) {
    const sample = samples[name]
    setHtml(sample.html)
    setCss(sample.css)
    setFeedback(`โหลดตัวอย่าง ${name} แล้ว`)
  }

  return <div className="page-section playground-page">
    {feedback && <FeedbackToast message={feedback} />}
    <div className="container">
      <div className="page-hero compact playground-hero"><div className="page-icon"><Code2 size={31} /></div><div><span className="section-kicker"><Sparkles size={14} /> ลองเขียนได้เลย</span><h1>Playground</h1><p>ทดลองแก้ไขโค้ดและดูผลลัพธ์แบบสด ๆ พร้อมคัดลอกไปใช้ได้ทันที</p></div></div>

      <div className="sample-bar"><span>ลองตัวอย่าง:</span>{(Object.keys(samples) as Array<keyof typeof samples>).map((name) => <button key={name} onClick={() => loadSample(name)}>{name}</button>)}<button className="reset-button" onClick={() => { setHtml(starterHtml); setCss(starterCss); setFeedback('คืนค่าเริ่มต้นแล้ว') }}><RotateCcw size={15} />รีเซ็ต</button></div>

      <div className="playground-grid">
        <section className="editor-panel">
          <div className="editor-tabs"><div><button className={activeEditor === 'HTML' ? 'active' : ''} onClick={() => setActiveEditor('HTML')}>HTML</button><button className={activeEditor === 'CSS' ? 'active' : ''} onClick={() => setActiveEditor('CSS')}>CSS</button></div><button onClick={() => void handleCopy(activeEditor === 'HTML' ? html : css, activeEditor)}><Clipboard size={16} />คัดลอก</button></div>
          <div className="editor-wrap"><div className="line-numbers">{(activeEditor === 'HTML' ? html : css).split('\n').map((_, index) => <span key={index}>{index + 1}</span>)}</div><textarea value={activeEditor === 'HTML' ? html : css} onChange={(event) => activeEditor === 'HTML' ? setHtml(event.target.value) : setCss(event.target.value)} spellCheck={false} aria-label={`แก้ไข ${activeEditor}`} /></div>
          <div className="editor-footer"><span><Play size={15} fill="currentColor" />อัปเดตผลลัพธ์อัตโนมัติ</span><span>{(activeEditor === 'HTML' ? html : css).length} ตัวอักษร</span></div>
        </section>

        <section className="result-panel"><div className="result-heading"><div><span className="live-dot" /><h2>ผลลัพธ์</h2></div><span>Live Preview</span></div><iframe title="ผลลัพธ์ Playground" sandbox="" srcDoc={documentFor(html, css)} /></section>
      </div>
      <div className="playground-tip"><Lightbulb size={22} /><div><strong>เคล็ดลับสำหรับมือใหม่</strong><p>เริ่มจากเปลี่ยนสีใน CSS เช่น <code>#7c3aed</code> หรือปรับค่า <code>border-radius</code> แล้วสังเกตผลลัพธ์ด้านขวา</p></div></div>
    </div>
  </div>
}
