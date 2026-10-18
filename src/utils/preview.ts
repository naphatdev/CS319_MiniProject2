import type { UiComponent } from '../types/component'

const previewBaseCss = `
  * { box-sizing: border-box; }
  html, body { width: 100%; height: 100%; margin: 0; }
  body { display: grid; place-items: center; padding: 24px; overflow: hidden; background: #f8f9fd; font-family: 'Prompt', 'Noto Sans Thai', Arial, sans-serif; color: #1e1b4b; }
  button, input { font: inherit; }
`

export function createPreviewDocument(component: Pick<UiComponent, 'name' | 'htmlCode' | 'cssCode'>): string {
  return `<!doctype html><html lang="th"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${component.name}</title><style>${previewBaseCss}${component.cssCode}</style></head><body>${component.htmlCode}</body></html>`
}

export async function copyText(text: string): Promise<void> {
  await navigator.clipboard.writeText(text)
}
