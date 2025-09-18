import { Router } from 'express'
import { ShortUrl } from '../models/ShortUrl.js'

const router = Router()

router.get('/:shortcode', async (req,res,next)=>{
  try {
    const code = req.params.shortcode
    const doc = await ShortUrl.findOne({ shortcode: code })
    if(!doc) return res.status(404).json({ error: 'Not found' })
    if(doc.expiry < new Date()) return res.status(410).json({ error: 'Expired' })
    doc.clicks += 1
    doc.clickLogs.push({ referrer: req.get('referer')||'', ua: req.get('user-agent')||'', lang: req.get('accept-language')||'' })
    await doc.save()
    res.redirect(doc.url)
  } catch(e){ next(e) }
})

export default router