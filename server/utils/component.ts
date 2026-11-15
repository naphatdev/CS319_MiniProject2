import type { Component, Category } from '../generated/prisma/client.js'

type ComponentWithCategory = Component & { category: Category }

export function toComponentResponse(component: ComponentWithCategory) {
  return {
    id: component.id,
    name: component.name,
    thaiName: component.thaiName,
    category: component.category.name,
    framework: component.framework,
    description: component.description,
    htmlCode: component.htmlCode,
    cssCode: component.cssCode,
    tailwindCode: component.tailwindCode,
    aiPrompt: component.aiPrompt,
    accent: component.accent,
    createdAt: component.createdAt,
    updatedAt: component.updatedAt,
  }
}
