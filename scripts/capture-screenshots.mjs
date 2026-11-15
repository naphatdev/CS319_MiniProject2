import { spawn } from 'node:child_process'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

const chromeCandidates = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  path.join(process.env.LOCALAPPDATA ?? '', 'Google', 'Chrome', 'Application', 'chrome.exe'),
]
const chromePath = chromeCandidates.find((candidate) => candidate && process.getBuiltinModule('node:fs').existsSync(candidate))
if (!chromePath) throw new Error('Google Chrome was not found')

const webUrl = process.env.CAPTURE_WEB_URL ?? 'http://127.0.0.1:5173'
const apiUrl = process.env.CAPTURE_API_URL ?? 'http://127.0.0.1:3001/api'
const outputDir = path.resolve('screenshots', 'hw3')
const profileDir = await mkdtemp(path.join(os.tmpdir(), 'nataui-capture-'))
const debugPort = 9300 + Math.floor(Math.random() * 300)
await mkdir(outputDir, { recursive: true })

const browser = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--no-first-run',
  `--remote-debugging-port=${debugPort}`,
  `--user-data-dir=${profileDir}`,
  'about:blank',
], { stdio: 'ignore', windowsHide: true })

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))

async function waitForJson(pathname) {
  let lastError
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${debugPort}${pathname}`)
      if (response.ok) return response.json()
    } catch (error) {
      lastError = error
    }
    await delay(100)
  }
  throw lastError ?? new Error('Chrome DevTools did not start')
}

class CdpClient {
  constructor(url) {
    this.socket = new WebSocket(url)
    this.sequence = 0
    this.pending = new Map()
  }

  async connect() {
    await new Promise((resolve, reject) => {
      this.socket.addEventListener('open', resolve, { once: true })
      this.socket.addEventListener('error', reject, { once: true })
    })
    this.socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data)
      if (!message.id) return
      const request = this.pending.get(message.id)
      if (!request) return
      this.pending.delete(message.id)
      if (message.error) request.reject(new Error(message.error.message))
      else request.resolve(message.result)
    })
  }

  send(method, params = {}) {
    const id = ++this.sequence
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject })
      this.socket.send(JSON.stringify({ id, method, params }))
    })
  }

  close() {
    this.socket.close()
  }
}

async function apiRequest(pathname, init) {
  const response = await fetch(`${apiUrl}${pathname}`, init)
  if (!response.ok) throw new Error(`API ${pathname} failed with ${response.status}`)
  return response.json()
}

let client
try {
  await waitForJson('/json/version')
  const targets = await waitForJson('/json/list')
  const pageTarget = targets.find((target) => target.type === 'page')
  if (!pageTarget?.webSocketDebuggerUrl) throw new Error('Chrome page target was not found')

  client = new CdpClient(pageTarget.webSocketDebuggerUrl)
  await client.connect()
  await client.send('Page.enable')
  await client.send('Runtime.enable')

  const components = await apiRequest('/components')
  const user = await apiRequest('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'demo@nataui.local', password: 'demo1234' }),
  })

  async function setViewport(width, height) {
    await client.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 600,
    })
  }

  async function navigate(url) {
    await client.send('Page.navigate', { url })
    await delay(700)
    await client.send('Runtime.evaluate', {
      expression: `Promise.all([
        document.fonts.ready,
        ...[...document.images].map(image => image.complete ? Promise.resolve() : new Promise(resolve => {
          image.addEventListener('load', resolve, { once: true })
          image.addEventListener('error', resolve, { once: true })
        })),
        new Promise(resolve => setTimeout(resolve, 700)),
      ])`,
      awaitPromise: true,
    })
    await client.send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0)' })
  }

  async function capture(filename) {
    const result = await client.send('Page.captureScreenshot', {
      format: 'png',
      fromSurface: true,
      captureBeyondViewport: false,
    })
    await writeFile(path.join(outputDir, filename), Buffer.from(result.data, 'base64'))
    console.log(`Captured ${filename}`)
  }

  await setViewport(1440, 1000)
  await navigate(`${webUrl}/`)
  await capture('01-explore-components.png')

  const componentId = components[0]?.id
  if (!componentId) throw new Error('No component data was returned')
  await navigate(`${webUrl}/components/${encodeURIComponent(componentId)}`)
  await capture('02-component-detail.png')

  await navigate(`${webUrl}/login`)
  await capture('03-login.png')
  await client.send('Runtime.evaluate', {
    expression: `[...document.querySelectorAll('button')].find(button => button.textContent?.trim() === 'สมัครสมาชิก')?.click()`,
  })
  await delay(300)
  await capture('04-register.png')

  await navigate(`${webUrl}/`)
  await client.send('Runtime.evaluate', {
    expression: `localStorage.setItem('nataui-session', ${JSON.stringify(JSON.stringify({ state: { user }, version: 0 }))})`,
  })
  await navigate(`${webUrl}/collection`)
  await capture('05-my-collection.png')

  await navigate(`${webUrl}/manage`)
  await capture('06-manage-crud.png')

  await navigate(`${webUrl}/playground`)
  await capture('07-playground.png')

  await navigate(`${webUrl}/about`)
  await capture('08-about.png')

  await setViewport(390, 844)
  await navigate(`${webUrl}/`)
  await capture('09-mobile-explore.png')
} finally {
  client?.close()
  browser.kill()
  await delay(600)
  await rm(profileDir, { recursive: true, force: true, maxRetries: 4, retryDelay: 250 }).catch(() => undefined)
}
