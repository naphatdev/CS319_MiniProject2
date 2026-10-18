import { Heart, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ComponentCard } from '../components/gallery/ComponentCard'
import { ErrorState, LoadingGrid } from '../components/common/States'
import { useComponents } from '../hooks/useComponents'
import { useFavoritesStore } from '../stores/useFavoritesStore'

export function CollectionPage() {
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds)
  const { data, isLoading, isError, refetch } = useComponents()
  const favorites = (data ?? []).filter((component) => favoriteIds.includes(component.id))

  return <div className="page-section collection-page">
    <div className="container">
      <div className="page-hero compact">
        <div className="page-icon"><Heart size={31} /></div>
        <div><h1>My Collection</h1><p>รวมตัวอย่างที่คุณชื่นชอบไว้ที่นี่ กลับมาดูเมื่อไรก็ได้</p></div>
        <div className="count-card"><Heart size={20} /><div><strong>{favoriteIds.length}</strong><span>รายการที่บันทึกไว้</span></div></div>
      </div>

      {isLoading && <LoadingGrid count={6} />}
      {isError && <ErrorState onRetry={() => void refetch()} />}
      {!isLoading && !isError && favorites.length === 0 && <div className="collection-empty"><div className="empty-heart"><Heart size={48} /></div><h2>คอลเลกชันยังว่างอยู่</h2><p>กดไอคอนหัวใจบนตัวอย่างที่ชอบ แล้วเราจะเก็บไว้ให้คุณ</p><Link className="button primary" to="/">สำรวจตัวอย่าง <Sparkles size={17} /></Link></div>}
      {!isLoading && !isError && favorites.length > 0 && <><div className="collection-toolbar"><h2>ตัวอย่างที่บันทึกไว้</h2><span>{favorites.length} รายการ</span></div><div className="component-grid">{favorites.map((component) => <ComponentCard key={component.id} component={component} removable />)}</div></>}
    </div>
  </div>
}
