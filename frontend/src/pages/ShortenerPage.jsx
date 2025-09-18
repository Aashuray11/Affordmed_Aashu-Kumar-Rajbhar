import { useState, useEffect } from 'react'
import { Grid, Card, CardContent, Typography, TextField, Button, Snackbar, Alert, CircularProgress, Stack } from '@mui/material'
import dayjs from 'dayjs'
const urlRegex = /^(https?:\/\/)[\w.-]+(\.[\w\.-]+)+(\/[\w\-._~:/?#[\]@!$&'()*+,;=.]*)?$/i
export default function ShortenerPage(){
  const [rows,setRows]=useState([{ url:'', validity:'', shortcode:'' }])
  const [loading,setLoading]=useState(false)
  const [results,setResults]=useState([])
  const [snack,setSnack]=useState({ open:false, severity:'success', msg:'' })
  const [tick,setTick]=useState(0)
  useEffect(()=>{ const id=setInterval(()=>setTick(t=>t+1),1000); return ()=>clearInterval(id) },[])
  function addRow(){ if(rows.length<5) setRows([...rows,{ url:'', validity:'', shortcode:'' }]) }
  function update(i,field,val){ const copy=[...rows]; copy[i][field]=val; setRows(copy) }
  function remove(i){ if(rows.length===1) return; setRows(rows.filter((_,idx)=>idx!==i)) }
  async function submit(){
    const payload=[]
    for(const r of rows){
      if(!r.url || !urlRegex.test(r.url)){ setSnack({ open:true, severity:'error', msg:'Invalid URL' }); return }
      if(r.validity && !/^\d+$/.test(r.validity)){ setSnack({ open:true, severity:'error', msg:'Validity must be integer' }); return }
      payload.push({ url:r.url, validity: r.validity?parseInt(r.validity):undefined, shortcode: r.shortcode||undefined })
    }
    setLoading(true)
    try{
      let created
      if(payload.length===1){
        const res= await fetch(import.meta.env.VITE_API_BASE+'/shorturls',{ method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(payload[0]) })
        if(!res.ok){ const err= await res.json().catch(()=>({ error:'Error'})); throw new Error(err.error||'Error') }
        created=[ await res.json() ]
      } else {
        const res= await fetch(import.meta.env.VITE_API_BASE+'/shorturls/batch',{ method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(payload) })
        if(!res.ok){ const err= await res.json().catch(()=>({ error:'Error'})); throw new Error(err.error||'Error') }
        created= await res.json()
      }
      const filtered = created.filter(x=>!x.error)
      const failures = created.filter(x=>x.error)
      if(filtered.length) setResults(filtered.concat(results))
      if(failures.length && !filtered.length) setSnack({ open:true, severity:'error', msg: failures[0].error })
      else if(failures.length) setSnack({ open:true, severity:'warning', msg: `Partial: ${failures.length} failed` })
      else setSnack({ open:true, severity:'success', msg:'Created' })
    }catch(e){ setSnack({ open:true, severity:'error', msg:e.message }) }
    finally{ setLoading(false) }
  }
  function formatCountdown(exp){
    const now=Date.now()
    const end=new Date(exp).getTime()
    const diff=end-now
    if(diff<=0) return 'expired'
    const s=Math.floor(diff/1000)
    const h=Math.floor(s/3600)
    const m=Math.floor((s%3600)/60)
    const sec=s%60
    return (h>0? h+':'+String(m).padStart(2,'0')+':'+String(sec).padStart(2,'0') : m+':'+String(sec).padStart(2,'0'))
  }
  return <Stack spacing={4}>
    <Stack spacing={2}>
      {rows.map((r,i)=>(
        <Card key={i} sx={{ p:2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={5}><TextField fullWidth size="small" label="Long URL" value={r.url} onChange={e=>update(i,'url',e.target.value)}/></Grid>
            <Grid item xs={6} md={2}><TextField fullWidth size="small" label="Validity (min)" value={r.validity} onChange={e=>update(i,'validity',e.target.value)}/></Grid>
            <Grid item xs={6} md={2}><TextField fullWidth size="small" label="Shortcode" value={r.shortcode} onChange={e=>update(i,'shortcode',e.target.value)}/></Grid>
            <Grid item xs={6} md={2}><Button disabled={loading} onClick={()=>remove(i)} color="secondary" variant="outlined" fullWidth>Remove</Button></Grid>
          </Grid>
        </Card>
      ))}
      <Button disabled={rows.length>=5||loading} onClick={addRow} variant="outlined">Add URL</Button>
      <Button disabled={loading} onClick={submit} variant="contained" color="primary" sx={{ alignSelf:'flex-start' }}>{loading?<CircularProgress size={20} color="inherit"/>:'Shorten'}</Button>
    </Stack>
    <Stack spacing={2}>
      {results.map((r,i)=>(
        <Card key={i}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">{r.shortLink}</Typography>
            <Typography variant="body2" sx={{ mt:0.5 }}>{r.original||r.url}</Typography>
            <Typography variant="caption" color={formatCountdown(r.expiry)==='expired'?'error.main':'text.secondary'}>Expires {dayjs(r.expiry).format('YYYY-MM-DD HH:mm')} ( {formatCountdown(r.expiry)} )</Typography>
          </CardContent>
        </Card>
      ))}
      {!results.length && <Typography variant="body2" color="text.secondary">No shortened URLs yet</Typography>}
    </Stack>
    <Snackbar open={snack.open} autoHideDuration={3000} onClose={()=>setSnack({...snack,open:false})} anchorOrigin={{ vertical:'top', horizontal:'center' }}>
      <Alert severity={snack.severity} onClose={()=>setSnack({...snack,open:false})}>{snack.msg}</Alert>
    </Snackbar>
  </Stack>
}