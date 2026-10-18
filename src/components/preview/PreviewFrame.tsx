import { useEffect, useRef } from 'react'
import type { UiComponent } from '../../types/component'
import { createPreviewDocument } from '../../utils/preview'

const FIT_WIDTH = 680
const FIT_HEIGHT = 360

interface PreviewFrameProps {
  component: UiComponent
  title?: string
  className?: string
  fit?: boolean
}

export function PreviewFrame({ component, title, className = '', fit = false }: PreviewFrameProps) {
  const frameRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (!fit || !frameRef.current) return
    const frame = frameRef.current
    const container = frame.parentElement
    if (!container) return

    const updateScale = () => {
      const availableWidth = Math.max(container.clientWidth - 24, 1)
      const availableHeight = Math.max(container.clientHeight - 24, 1)
      const scale = Math.min(availableWidth / FIT_WIDTH, availableHeight / FIT_HEIGHT, 1)
      frame.style.setProperty('--preview-fit-scale', String(scale))
    }

    updateScale()
    const observer = new ResizeObserver(updateScale)
    observer.observe(container)
    window.addEventListener('resize', updateScale)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateScale)
    }
  }, [fit])

  return (
    <iframe
      ref={frameRef}
      className={`preview-frame ${fit ? 'fit-frame' : ''} ${className}`}
      title={title ?? `ตัวอย่าง ${component.thaiName}`}
      sandbox=""
      loading="lazy"
      srcDoc={createPreviewDocument(component)}
    />
  )
}
