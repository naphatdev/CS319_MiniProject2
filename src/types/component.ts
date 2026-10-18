export const CATEGORIES = [
  'ทั้งหมด',
  'ปุ่ม',
  'การ์ด',
  'เมนู',
  'แบบฟอร์ม',
  'โหลดเดอร์',
  'สวิตช์',
  'แจ้งเตือน',
] as const

export type Category = Exclude<(typeof CATEGORIES)[number], 'ทั้งหมด'>
export type Framework = 'CSS' | 'Tailwind CSS'

export interface UiComponent {
  id: string
  name: string
  thaiName: string
  category: Category
  framework: Framework
  description: string
  htmlCode: string
  cssCode: string
  tailwindCode: string
  aiPrompt: string
  accent: string
}

export interface ComponentFilters {
  category?: Category
  framework?: Framework
}
