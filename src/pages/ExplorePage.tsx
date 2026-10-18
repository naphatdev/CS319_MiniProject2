import { useMemo, useState } from 'react'
import { Bot, Boxes, LayoutGrid, Search } from 'lucide-react'
import { ComponentCard } from '../components/gallery/ComponentCard'
import { EmptyState, ErrorState, LoadingGrid } from '../components/common/States'
import { useComponents } from '../hooks/useComponents'
import { CATEGORIES, type Category, type Framework } from '../types/component'

const quickCategories = [
  { label: 'ปุ่ม', icon: '◉' },
  { label: 'การ์ด', icon: '▱' },
  { label: 'เมนู', icon: '☰' },
  { label: 'แบบฟอร์ม', icon: '▤' },
  { label: 'แจ้งเตือน', icon: '♢' },
] as const

export function ExplorePage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('ทั้งหมด')
  const [framework, setFramework] = useState<'ทั้งหมด' | Framework>('ทั้งหมด')
  const filters = {
    ...(category !== 'ทั้งหมด' ? { category: category as Category } : {}),
    ...(framework !== 'ทั้งหมด' ? { framework } : {}),
  }
  const { data, isLoading, isError, refetch } = useComponents(filters)

  const filteredComponents = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('th')
    if (!query) return data ?? []
    return (data ?? []).filter((component) =>
      [component.name, component.thaiName, component.description]
        .join(' ')
        .toLocaleLowerCase('th')
        .includes(query),
    )
  }, [data, search])

  const scrollToGallery = () => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <>
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="nata-hero-content">
            <h1><span>NaTaUI</span><br />คลังไอเดียหน้าตาเว็บ<br />ที่ใครก็เริ่มสร้างได้</h1>
            <p>รวมตัวอย่างปุ่ม การ์ด เมนู และส่วนประกอบเว็บไซต์ที่คุณเลือกดู แคปภาพ และนำไปให้ AI ช่วยสร้างเว็บต่อได้ทันที</p>
            <div className="hero-stats">
              <div><strong>21</strong><span>ตัวอย่างพร้อมใช้</span></div>
              <div><strong>7</strong><span>หมวดหมู่</span></div>
              <div><strong>ฟรี</strong><span>สำหรับทุกคน</span></div>
            </div>
          </div>

          <div className="hero-art" aria-label="ภาพประกอบหน้าต่าง UI">
            <div className="art-glow" />
            <div className="browser-card back-card">
              <div className="browser-bar"><i /><i /><i /></div>
              <div className="mini-sidebar" />
              <div className="mini-content"><span /><span /><span /><button /></div>
            </div>
            <div className="browser-card front-card">
              <div className="browser-bar"><i /><i /><i /></div>
              <div className="wire-row"><b /><span /><span /></div>
              <div className="wire-grid"><i /><i /><i /><i /></div>
            </div>
            <div className="ai-orb"><Bot size={29} /><span>AI</span></div>
            <div className="floating-chip chip-one">Good UI ✦</div>
            <div className="floating-chip chip-two">สร้างเว็บง่ายขึ้น</div>
          </div>
        </div>
      </section>

      <section className="search-panel-section">
        <div className="container">
          <div className="search-bar-large">
            <Search size={21} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ค้นหาตัวอย่าง เช่น ปุ่ม, การ์ด, เมนู, แบบฟอร์ม..." aria-label="ค้นหาคอมโพเนนต์" />
            <button onClick={scrollToGallery} aria-label="ค้นหา"><Search size={19} /></button>
          </div>
          <div className="quick-categories">
            {quickCategories.map((item) => (
              <button key={item.label} className={category === item.label ? 'quick-category selected' : 'quick-category'} onClick={() => setCategory(item.label as Category)}>
                <span>{item.icon}</span><div><strong>{item.label}</strong><small>ดูตัวอย่าง</small></div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="gallery-section" id="gallery">
        <div className="container">
          <div className="section-heading">
            <div><span className="section-kicker"><LayoutGrid size={15} /> คลังไอเดีย</span><h2>เลือกหน้าตาที่ชอบ</h2><p>แตะหัวใจเพื่อเก็บไว้ในคอลเลกชัน หรือเปิดดูโค้ดพร้อมใช้งาน</p></div>
            <span className="result-count">{filteredComponents.length} รายการ</span>
          </div>
          <div className="filters-row" aria-label="ตัวกรอง">
            <div className="filter-scroll">
              {CATEGORIES.map((item) => <button key={item} className={category === item ? 'filter-pill selected' : 'filter-pill'} onClick={() => setCategory(item)}>{item}</button>)}
            </div>
            <div className="framework-filter">
              {(['ทั้งหมด', 'CSS', 'Tailwind CSS'] as const).map((item) => <button key={item} className={framework === item ? 'selected' : ''} onClick={() => setFramework(item)}>{item}</button>)}
            </div>
          </div>

          {isLoading && <LoadingGrid count={8} />}
          {isError && <ErrorState onRetry={() => void refetch()} />}
          {!isLoading && !isError && filteredComponents.length === 0 && <EmptyState title="ยังไม่มีแบบที่ตรงใจ" />}
          {!isLoading && !isError && filteredComponents.length > 0 && <div className="component-grid">{filteredComponents.map((component) => <ComponentCard component={component} key={component.id} />)}</div>}
        </div>
      </section>

      <section className="how-section" id="how-it-works">
        <div className="container">
          <div className="section-heading centered"><div><span className="section-kicker"><Boxes size={15} /> เริ่มต้นง่ายมาก</span><h2>จากไอเดียสู่เว็บไซต์ใน 3 ขั้นตอน</h2></div></div>
          <div className="steps-grid">
            <article><span>01</span><h3>เลือกแบบที่ชอบ</h3><p>สำรวจคลัง UI แล้วเลือกองค์ประกอบที่เข้ากับเว็บของคุณ</p></article>
            <article><span>02</span><h3>แคปภาพตัวอย่าง</h3><p>แคปเฉพาะหน้าตา UI ที่ชอบ พร้อมคำอธิบายสำหรับ AI</p></article>
            <article><span>03</span><h3>ให้ AI ช่วยสร้าง</h3><p>แนบภาพและ Prompt เพื่อให้ AI สร้างหน้าตาใกล้เคียงได้ทันที</p></article>
          </div>
        </div>
      </section>
    </>
  )
}
