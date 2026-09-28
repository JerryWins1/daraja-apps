(async()=>{
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
await sleep(3200);
const VW=innerWidth, VH=innerHeight;
const K=document.getElementById('djDock');
const floats=[...document.querySelectorAll('body *')].filter(e=>{
  const c=getComputedStyle(e); if(c.position!=='fixed') return false;
  if(c.display==='none'||c.visibility==='hidden'||+c.opacity===0) return false;
  const r=e.getBoundingClientRect();
  return r.width>20&&r.height>20&&r.width<130&&r.height<130;
}).map(e=>e.id||e.className||e.tagName);
let worst=null, n=0;
document.querySelectorAll('body *').forEach(el=>{
  const r=el.getBoundingClientRect(); if(r.width<2||r.height<2) return;
  const c=getComputedStyle(el);
  if(c.visibility==='hidden'||c.display==='none'||+c.opacity===0) return;
  if(r.right>VW+1 && r.width<=VW*1.6 && (!el.querySelector('*')||r.width>VW+1)){
    n++; const o=Math.round(r.right-VW);
    if(!worst||o>worst.over) worst={el:el.tagName.toLowerCase()+(el.id?'#'+el.id:''), over:o, txt:(el.textContent||'').trim().slice(0,24)};
  }
});
return {app:document.title.slice(0,36),
  sideScroll:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-VW,
  overflowN:n, worst,
  dockShown: K?[...K.children].filter(x=>x.getBoundingClientRect().width>0).map(x=>x.id):'no dock',
  floatingButtons: floats};
})()
