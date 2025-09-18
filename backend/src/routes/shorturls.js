import { Router } from 'express'
import { ShortUrl } from '../models/ShortUrl.js'
import { generateShortcode } from '../utils/shortcode.js'

const router = Router()

router.post('/', async (req,res,next)=>{
  try {
    const { url, validity, shortcode } = req.body
    if(!url) return res.status(400).json({ error: 'url required' })
    let code = shortcode && shortcode.trim()
    if(code){
      const exists = await ShortUrl.findOne({ shortcode: code })
      if(exists) return res.status(409).json({ error: 'shortcode exists' })
    } else {
      do { code = generateShortcode() } while(await ShortUrl.findOne({ shortcode: code }))
    }
    const validityMinutes = Number.isInteger(validity) ? validity : 30
    const now = new Date()
    const expiry = new Date(now.getTime() + validityMinutes*60000)
    const doc = await ShortUrl.create({ url, shortcode: code, validityMinutes, createdAt: now, expiry })
    const host = process.env.HOSTNAME || `http://localhost:${process.env.PORT||4000}`
    res.status(201).json({ shortLink: host + '/' + doc.shortcode, expiry: doc.expiry })
  } catch(e){ next(e) }
})

router.get('/', async (req,res,next)=>{
  try {
    const list = await ShortUrl.find().sort({ createdAt: -1 }).lean()
    const host = process.env.HOSTNAME || `http://localhost:${process.env.PORT||4000}`
    res.json(list.map(x=>({
      shortcode: x.shortcode,
      url: x.url,
      createdAt: x.createdAt,
      expiry: x.expiry,
      clicks: x.clicks,
      shortLink: host + '/' + x.shortcode
    })))
  } catch(e){ next(e) }
})

router.get('/:shortcode', async (req,res,next)=>{
  try {
    const code = req.params.shortcode
    const doc = await ShortUrl.findOne({ shortcode: code })
    if(!doc) return res.status(404).json({ error: 'Not found' })
    res.json({
      url: doc.url,
      shortcode: doc.shortcode,
      createdAt: doc.createdAt,
      expiry: doc.expiry,
      clicks: doc.clicks,
      clickLogs: doc.clickLogs
    })
  } catch(e){ next(e) }
})

export default router