import mongoose from 'mongoose'

const clickLogSchema = new mongoose.Schema({
  ts: { type: Date, default: Date.now },
  referrer: String,
  ua: String,
  lang: String
},{ _id: false })

const shortUrlSchema = new mongoose.Schema({
  url: { type: String, required: true },
  shortcode: { type: String, required: true, unique: true, index: true },
  validityMinutes: { type: Number, default: 30 },
  createdAt: { type: Date, default: Date.now },
  expiry: { type: Date, required: true },
  clicks: { type: Number, default: 0 },
  clickLogs: [clickLogSchema]
})

shortUrlSchema.index({ expiry: 1 }, { expireAfterSeconds: 0, partialFilterExpression: { expiry: { $exists: true } } })

export const ShortUrl = mongoose.model('ShortUrl', shortUrlSchema)