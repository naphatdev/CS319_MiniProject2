import 'dotenv/config'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../server/generated/prisma/client.js'

interface SeedComponent {
  id: string
  name: string
  thaiName: string
  category: string
  framework: string
  description: string
  htmlCode: string
  cssCode: string
  tailwindCode: string
  aiPrompt: string
  accent: string
}

interface SeedDatabase {
  components: SeedComponent[]
}

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error('DATABASE_URL is required to seed the database')

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) })

async function main() {
  const databasePath = fileURLToPath(new URL('../server/db.json', import.meta.url))
  const database = JSON.parse(await readFile(databasePath, 'utf8')) as SeedDatabase

  const categoryNames = [...new Set(database.components.map((component) => component.category))]
  const categories = new Map<string, number>()

  for (const name of categoryNames) {
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    })
    categories.set(name, category.id)
  }

  for (const component of database.components) {
    const categoryId = categories.get(component.category)
    if (!categoryId) throw new Error(`Category not found for ${component.id}`)

    const data = {
      name: component.name,
      thaiName: component.thaiName,
      categoryId,
      framework: component.framework,
      description: component.description,
      htmlCode: component.htmlCode,
      cssCode: component.cssCode,
      tailwindCode: component.tailwindCode,
      aiPrompt: component.aiPrompt,
      accent: component.accent,
    }
    await prisma.component.upsert({
      where: { id: component.id },
      update: data,
      create: { id: component.id, ...data },
    })
  }

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@nataui.local' },
    update: { name: 'Demo User', password: 'demo1234' },
    create: { email: 'demo@nataui.local', name: 'Demo User', password: 'demo1234' },
  })

  for (const component of database.components.slice(0, 3)) {
    await prisma.favorite.upsert({
      where: { userId_componentId: { userId: demoUser.id, componentId: component.id } },
      update: {},
      create: { userId: demoUser.id, componentId: component.id },
    })
  }

  console.log(`Seeded ${database.components.length} components, ${categoryNames.length} categories, and 3 demo favorites`)
}

main()
  .catch((error: unknown) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
