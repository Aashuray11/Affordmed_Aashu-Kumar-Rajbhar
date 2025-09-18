import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const logDir = path.join(__dirname, '../../logs')
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir)
const accessLog = path.join(logDir, 'access.log')

export function loggingMiddleware(req, res, next) {
  const start = Date.now()
  res.on('finish', () => {
    const line = [new Date().toISOString(), req.method, req.originalUrl, res.statusCode, Date.now() - start].join(' ') + '\n'
    fs.appendFile(accessLog, line, ()=>{})
  })
  next()
}