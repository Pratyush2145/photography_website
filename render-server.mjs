import { createServer } from 'node:http'
import { fileURLToPath } from 'node:url'
import { dirname, join, extname, resolve } from 'node:path'
import { stat, readFile } from 'node:fs/promises'
import { createReadStream } from 'node:fs'
import { Readable } from 'node:stream'
import server from './dist/server/server.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const CLIENT_DIR = resolve(__dirname, 'dist/client')
const PORT = Number(process.env.PORT || 3000)

const MIME_TYPES = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'application/javascript; charset=utf-8'],
  ['.mjs', 'application/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.webp', 'image/webp'],
  ['.gif', 'image/gif'],
  ['.ico', 'image/x-icon'],
  ['.mp4', 'video/mp4'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
  ['.ttf', 'font/ttf'],
  ['.otf', 'font/otf'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.xml', 'application/xml; charset=utf-8']
])

const STATIC_PREFIXES = ['/assets/', '/videos/', '/favicon.ico', '/robots.txt', '/manifest.json', '/icons/']

function getContentType(pathname) {
  return MIME_TYPES.get(extname(pathname).toLowerCase()) || 'application/octet-stream'
}

async function serveStatic(pathname, req, res) {
  const filePath = resolve(CLIENT_DIR, `.${pathname}`)
  if (!filePath.startsWith(CLIENT_DIR)) {
    res.writeHead(403)
    return res.end('Forbidden')
  }

  try {
    const stats = await stat(filePath)
    if (!stats.isFile()) {
      res.writeHead(404)
      return res.end('Not found')
    }

    const contentType = getContentType(filePath)
    const totalSize = stats.size
    const range = req.headers.range

    // Support Range requests for streaming (required for smooth video playback)
    if (range) {
      const bytesPrefix = 'bytes='
      const rangeStr = range.startsWith(bytesPrefix) ? range.slice(bytesPrefix.length) : range
      const [startStr, endStr] = rangeStr.split('-')
      const start = parseInt(startStr, 10) || 0
      const end = endStr ? parseInt(endStr, 10) : totalSize - 1

      if (start >= totalSize || end >= totalSize) {
        res.writeHead(416, { 'Content-Range': `bytes */${totalSize}` })
        return res.end()
      }

      const chunkSize = end - start + 1
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${totalSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': String(chunkSize),
        'Content-Type': contentType
      })

      const stream = createReadStream(filePath, { start, end })
      stream.pipe(res)
      return
    }

    // Fallback: stream entire file with correct headers
    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': String(totalSize),
      'Accept-Ranges': 'bytes'
    })
    const stream = createReadStream(filePath)
    stream.pipe(res)
    return
  } catch (error) {
    res.writeHead(404)
    res.end('Not found')
  }
}

async function handleRequest(req, res) {
  try {
    const url = new URL(req.url, `http://localhost`)
    if (STATIC_PREFIXES.some((prefix) => url.pathname.startsWith(prefix))) {
      return serveStatic(url.pathname, req, res)
    }

    const request = new Request(url.toString(), {
      method: req.method,
      headers: req.headers,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : Readable.toWeb(req)
    })

    const response = await server.fetch(request, undefined, undefined)
    res.writeHead(response.status, Object.fromEntries(response.headers.entries()))

    if (response.body) {
      const nodeStream = Readable.from(response.body)
      nodeStream.pipe(res)
    } else {
      res.end()
    }
  } catch (error) {
    console.error(error)
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('Internal Server Error')
  }
}

createServer(handleRequest).listen(PORT, () => {
  console.log(`Render server listening on http://localhost:${PORT}`)
})
