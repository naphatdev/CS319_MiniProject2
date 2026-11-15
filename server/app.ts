import express, { type NextFunction, type Request, type RequestHandler, type Response } from 'express'
import cors from 'cors'
import { prisma } from './lib/prisma.js'
import { toComponentResponse } from './utils/component.js'

type JsonRecord = Record<string, unknown>

function asyncHandler(handler: (request: Request, response: Response) => Promise<void>): RequestHandler {
  return (request, response, next) => {
    void handler(request, response).catch(next)
  }
}

function bodyRecord(request: Request): JsonRecord {
  if (!request.body || typeof request.body !== 'object' || Array.isArray(request.body)) {
    throw new HttpError(400, 'Request body must be a JSON object')
  }
  return request.body as JsonRecord
}

function requiredString(body: JsonRecord, key: string): string {
  const value = body[key]
  if (typeof value !== 'string' || !value.trim()) {
    throw new HttpError(400, `${key} is required`)
  }
  return value.trim()
}

function requiredText(body: JsonRecord, key: string): string {
  const value = body[key]
  if (typeof value !== 'string') throw new HttpError(400, `${key} is required`)
  return value.trim()
}

function optionalString(body: JsonRecord, key: string): string | undefined {
  const value = body[key]
  if (value === undefined) return undefined
  if (typeof value !== 'string') throw new HttpError(400, `${key} must be a string`)
  return value.trim()
}

function routeParam(request: Request, key: string): string {
  const value = request.params[key]
  if (typeof value !== 'string' || !value) throw new HttpError(400, `${key} route parameter is required`)
  return value
}

function prismaErrorCode(error: unknown): string | undefined {
  if (!error || typeof error !== 'object' || !('code' in error)) return undefined
  return typeof error.code === 'string' ? error.code : undefined
}

class HttpError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message)
  }
}

async function saveComponent(request: Request, response: Response, partial: boolean) {
  const body = bodyRecord(request)
  const categoryName = partial ? optionalString(body, 'category') : requiredString(body, 'category')
  const category = categoryName
    ? await prisma.category.upsert({
        where: { name: categoryName },
        update: {},
        create: { name: categoryName },
      })
    : undefined

  const fields = ['name', 'thaiName', 'framework', 'description', 'htmlCode', 'cssCode', 'tailwindCode', 'aiPrompt', 'accent'] as const
  const data: JsonRecord = {}
  for (const field of fields) {
    const value = partial
      ? optionalString(body, field)
      : field === 'tailwindCode'
        ? requiredText(body, field)
        : requiredString(body, field)
    if (value !== undefined) data[field] = value
  }
  if (category) data.categoryId = category.id

  if (partial) {
    const component = await prisma.component.update({
      where: { id: routeParam(request, 'id') },
      data,
      include: { category: true },
    })
    response.json(toComponentResponse(component))
    return
  }

  const component = await prisma.component.create({
    data: {
      id: requiredString(body, 'id'),
      name: data.name as string,
      thaiName: data.thaiName as string,
      framework: data.framework as string,
      description: data.description as string,
      htmlCode: data.htmlCode as string,
      cssCode: data.cssCode as string,
      tailwindCode: data.tailwindCode as string,
      aiPrompt: data.aiPrompt as string,
      accent: data.accent as string,
      categoryId: category!.id,
    },
    include: { category: true },
  })
  response.status(201).json(toComponentResponse(component))
}

export const app = express()

const allowedOrigins = (process.env.CLIENT_ORIGIN ?? 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(cors({ origin: allowedOrigins }))
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', asyncHandler(async (_request, response) => {
  await prisma.$queryRaw`SELECT 1`
  response.json({ status: 'ok', database: 'connected' })
}))

app.post('/api/auth/register', asyncHandler(async (request, response) => {
  const body = bodyRecord(request)
  const email = requiredString(body, 'email').toLowerCase()
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new HttpError(400, 'Invalid email address')
  const name = requiredString(body, 'name')
  const password = requiredString(body, 'password')
  if (password.length < 4) throw new HttpError(400, 'รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร')

  const existingUser = await prisma.user.findUnique({ where: { email }, select: { id: true } })
  if (existingUser) throw new HttpError(409, 'อีเมลนี้ถูกสมัครใช้งานแล้ว')

  const user = await prisma.user.create({
    data: { email, name, password },
    select: { id: true, email: true, name: true, createdAt: true },
  })
  response.status(201).json(user)
}))

app.post('/api/auth/login', asyncHandler(async (request, response) => {
  const body = bodyRecord(request)
  const email = requiredString(body, 'email').toLowerCase()
  const password = requiredString(body, 'password')

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || user.password !== password) {
    throw new HttpError(401, 'อีเมลหรือรหัสผ่านไม่ถูกต้อง')
  }

  response.json({ id: user.id, email: user.email, name: user.name, createdAt: user.createdAt })
}))

app.get('/api/categories', asyncHandler(async (_request, response) => {
  const categories = await prisma.category.findMany({ orderBy: { id: 'asc' } })
  response.json(categories)
}))

app.get('/api/components', asyncHandler(async (request, response) => {
  const category = typeof request.query.category === 'string' ? request.query.category : undefined
  const framework = typeof request.query.framework === 'string' ? request.query.framework : undefined
  const search = typeof request.query.q === 'string' ? request.query.q.trim() : undefined
  const components = await prisma.component.findMany({
    where: {
      ...(category ? { category: { name: category } } : {}),
      ...(framework ? { framework } : {}),
      ...(search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { thaiName: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      } : {}),
    },
    include: { category: true },
    orderBy: { createdAt: 'asc' },
  })
  response.json(components.map(toComponentResponse))
}))

app.get('/api/components/:id', asyncHandler(async (request, response) => {
  const component = await prisma.component.findUnique({
    where: { id: routeParam(request, 'id') },
    include: { category: true },
  })
  if (!component) throw new HttpError(404, 'Component not found')
  response.json(toComponentResponse(component))
}))

app.post('/api/components', asyncHandler(async (request, response) => {
  await saveComponent(request, response, false)
}))

app.put('/api/components/:id', asyncHandler(async (request, response) => {
  await saveComponent(request, response, true)
}))

app.patch('/api/components/:id', asyncHandler(async (request, response) => {
  await saveComponent(request, response, true)
}))

app.delete('/api/components/:id', asyncHandler(async (request, response) => {
  await prisma.component.delete({ where: { id: routeParam(request, 'id') } })
  response.status(204).end()
}))

app.get('/api/users/:userId/favorites', asyncHandler(async (request, response) => {
  const favorites = await prisma.favorite.findMany({
    where: { userId: routeParam(request, 'userId') },
    include: { component: { include: { category: true } } },
    orderBy: { createdAt: 'desc' },
  })
  response.json(favorites.map((favorite) => ({
    id: favorite.id,
    userId: favorite.userId,
    componentId: favorite.componentId,
    createdAt: favorite.createdAt,
    component: toComponentResponse(favorite.component),
  })))
}))

app.post('/api/users/:userId/favorites', asyncHandler(async (request, response) => {
  const componentId = requiredString(bodyRecord(request), 'componentId')
  const userId = routeParam(request, 'userId')
  const favorite = await prisma.favorite.upsert({
    where: { userId_componentId: { userId, componentId } },
    update: {},
    create: { userId, componentId },
  })
  response.status(201).json(favorite)
}))

app.delete('/api/users/:userId/favorites/:componentId', asyncHandler(async (request, response) => {
  await prisma.favorite.delete({
    where: {
      userId_componentId: {
        userId: routeParam(request, 'userId'),
        componentId: routeParam(request, 'componentId'),
      },
    },
  })
  response.status(204).end()
}))

app.use((_request, response) => {
  response.status(404).json({ message: 'Route not found' })
})

app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  if (error instanceof HttpError) {
    response.status(error.status).json({ message: error.message })
    return
  }

  const code = prismaErrorCode(error)
  if (code === 'P2025') {
    response.status(404).json({ message: 'Record not found' })
    return
  }
  if (code === 'P2002') {
    response.status(409).json({ message: 'A record with this unique value already exists' })
    return
  }

  console.error(error)
  response.status(500).json({ message: 'Internal server error' })
})
