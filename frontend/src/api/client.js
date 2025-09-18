const base = import.meta.env.VITE_API_BASE
export async function api(path, options={}){
  const res = await fetch(base+path, options)
  let body=null
  try{ body=await res.json() }catch(e){}
  if(!res.ok){ const msg = body&&body.error?body.error:'Request failed'; throw new Error(msg) }
  return body
}