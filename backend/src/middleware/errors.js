export function notFound(req,res,next){
  res.status(404).json({ error: 'Not found' })
}
export function errorHandler(err,req,res,next){
  if(res.headersSent) return next(err)
  const status = err.status || 500
  res.status(status).json({ error: err.message || 'Server error' })
}