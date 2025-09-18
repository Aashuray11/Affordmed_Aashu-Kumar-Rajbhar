import { useState, useEffect } from 'react'
import { Table, TableHead, TableRow, TableCell, TableBody, Paper, TableContainer, CircularProgress, Dialog, DialogTitle, DialogContent, IconButton, Typography, Stack, Button } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import dayjs from 'dayjs'
export default function StatsPage(){
  const [loading,setLoading]=useState(true)
  const [items,setItems]=useState([])
  const [error,setError]=useState('')
  const [open,setOpen]=useState(false)
  const [detail,setDetail]=useState(null)
  const [tick,setTick]=useState(0)
  useEffect(()=>{ const id=setInterval(()=>setTick(t=>t+1),1000); return ()=>clearInterval(id) },[])
  async function load(){
    setLoading(true)
    try{
      const res = await fetch(import.meta.env.VITE_API_BASE+'/shorturls')
      if(!res.ok) throw new Error('Failed')
      const data = await res.json()
      setItems(data)
    }catch(e){ setError(e.message) }
    finally{ setLoading(false) }
  }
  function countdown(exp){
    const diff = new Date(exp).getTime() - Date.now()
    if(diff<=0) return 'expired'
    const s=Math.floor(diff/1000)
    const h=Math.floor(s/3600)
    const m=Math.floor((s%3600)/60)
    const sec=s%60
    return h>0? h+':'+String(m).padStart(2,'0')+':'+String(sec).padStart(2,'0') : m+':'+String(sec).padStart(2,'0')
  }
  async function openDetail(code){
    try{
      const res = await fetch(import.meta.env.VITE_API_BASE+'/shorturls/'+code)
      if(!res.ok) throw new Error('Failed')
      const data = await res.json()
      setDetail(data)
      setOpen(true)
    }catch(e){ setError(e.message) }
  }
  useEffect(()=>{ load() },[])
  return <Stack spacing={3}>
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography variant="h6">Statistics</Typography>
      <Button onClick={load} disabled={loading} variant="outlined">Refresh</Button>
    </Stack>
    {loading && <CircularProgress/>}
    {!loading && !items.length && <Typography variant="body2" color="text.secondary">No data</Typography>}
    {error && <Typography color="error" variant="body2">{error}</Typography>}
    {!loading && items.length>0 && <TableContainer component={Paper} sx={{ maxHeight:500 }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>Short URL</TableCell>
            <TableCell>Original URL</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Expiry</TableCell>
            <TableCell>Countdown</TableCell>
            <TableCell>Clicks</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map(i=>(
            <TableRow key={i.shortcode} hover>
              <TableCell><a href={i.shortLink} target="_blank" rel="noreferrer">{i.shortLink}</a></TableCell>
              <TableCell style={{ maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{i.url}</TableCell>
              <TableCell>{dayjs(i.createdAt).format('YYYY-MM-DD HH:mm')}</TableCell>
              <TableCell>{dayjs(i.expiry).format('YYYY-MM-DD HH:mm')}</TableCell>
              <TableCell style={{ color: countdown(i.expiry)==='expired' ? '#d32f2f' : '#555' }}>{countdown(i.expiry)}</TableCell>
              <TableCell>{i.clicks}</TableCell>
              <TableCell><Button size="small" variant="outlined" onClick={()=>openDetail(i.shortcode)}>Logs</Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>}
    <Dialog open={open} fullWidth maxWidth="md" onClose={()=>setOpen(false)}>
      <DialogTitle>Click Logs<IconButton onClick={()=>setOpen(false)} sx={{ position:'absolute', right:8, top:8 }}><CloseIcon/></IconButton></DialogTitle>
      <DialogContent dividers>
        {!detail && <Typography variant="body2" color="text.secondary">No detail</Typography>}
        {detail && detail.clickLogs && detail.clickLogs.length===0 && <Typography variant="body2" color="text.secondary">No clicks yet</Typography>}
        {detail && detail.clickLogs && detail.clickLogs.length>0 && <Table size="small">
          <TableHead><TableRow><TableCell>Time</TableCell><TableCell>Referrer</TableCell><TableCell>User Agent</TableCell><TableCell>Language</TableCell></TableRow></TableHead>
          <TableBody>
            {detail.clickLogs.map((c,idx)=>(<TableRow key={idx}><TableCell>{dayjs(c.ts).format('YYYY-MM-DD HH:mm:ss')}</TableCell><TableCell>{c.referrer||'-'}</TableCell><TableCell>{c.ua||'-'}</TableCell><TableCell>{c.lang||'-'}</TableCell></TableRow>))}
          </TableBody>
        </Table>}
      </DialogContent>
    </Dialog>
  </Stack>
}