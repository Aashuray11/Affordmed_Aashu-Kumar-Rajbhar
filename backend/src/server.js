import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import { connect } from './utils/db.js'
import shortUrlRouter from './routes/shorturls.js'
import redirectRouter from './routes/redirect.js'
import { loggingMiddleware } from './middleware/logging.js'
import { errorHandler, notFound } from './middleware/errors.js'

dotenv.config()
const app = express()
app.use(cors({ origin: 'http://localhost:3000' }))
app.use(express.json())
app.use(loggingMiddleware)
app.use('/shorturls', shortUrlRouter)
app.use('/', redirectRouter)
app.use(notFound)
app.use(errorHandler)
const port = process.env.PORT || 4000
connect().then(()=>{
  app.listen(port, ()=>{})
})
