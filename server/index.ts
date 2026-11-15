import 'dotenv/config'
import { app } from './app.js'
import { prisma } from './lib/prisma.js'

const port = Number(process.env.PORT ?? 3001)

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`NaTaUI API listening on http://localhost:${port}`)
})

async function shutdown(signal: string) {
  console.log(`Received ${signal}. Shutting down...`)
  server.close(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
}

process.on('SIGINT', () => void shutdown('SIGINT'))
process.on('SIGTERM', () => void shutdown('SIGTERM'))
