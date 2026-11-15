import { ArrowUpRight, Heart, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import type { UiComponent } from '../../types/component'
import { useFavoriteMutation, useFavorites } from '../../hooks/useFavorites'
import { PreviewFrame } from '../preview/PreviewFrame'

interface ComponentCardProps {
  component: UiComponent
  removable?: boolean
}

export function ComponentCard({ component, removable = false }: ComponentCardProps) {
  const navigate = useNavigate()
  const { data: favorites } = useFavorites()
  const favoriteMutation = useFavoriteMutation()
  const isFavorite = (favorites ?? []).some((favorite) => favorite.componentId === component.id)

  function handleFavorite() {
    if (!favoriteMutation.user) {
      navigate('/login')
      return
    }
    favoriteMutation.mutate({ componentId: component.id, favorite: isFavorite })
  }

  return (
    <article className="component-card">
      <div className="card-preview">
        <PreviewFrame component={component} fit />
        <button
          className={`favorite-button ${isFavorite ? 'selected' : ''}`}
          onClick={handleFavorite}
          disabled={favoriteMutation.isPending}
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
