import { ArrowUpRight, Heart, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { UiComponent } from '../../types/component'
import { useFavoritesStore } from '../../stores/useFavoritesStore'
import { PreviewFrame } from '../preview/PreviewFrame'

interface ComponentCardProps {
  component: UiComponent
  removable?: boolean
}

export function ComponentCard({ component, removable = false }: ComponentCardProps) {
  const isFavorite = useFavoritesStore((state) => state.favoriteIds.includes(component.id))
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite)

  return (
    <article className="component-card">
      <div className="card-preview">
        <PreviewFrame component={component} fit />
        <button
          className={`favorite-button ${isFavorite ? 'selected' : ''}`}
          onClick={() => toggleFavorite(component.id)}
          aria-label={isFavorite ? `นำ ${component.thaiName} ออกจากรายการโปรด` : `บันทึก ${component.thaiName}`}
        >
          {removable ? <Trash2 size={17} /> : <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />}
        </button>
      </div>
      <div className="component-card-body">
        <div>
          <h3>{component.name}</h3>
          <p>{component.thaiName}</p>
        </div>
        <Link to={`/components/${component.id}`} className="card-link" aria-label={`ดูรายละเอียด ${component.thaiName}`}><ArrowUpRight size={19} /></Link>
      </div>
      <div className="card-meta"><span>{component.category}</span><span>{component.framework}</span></div>
    </article>
  )
}
