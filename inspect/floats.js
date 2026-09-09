(async()=>{
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
await sleep(2600);
const VW=window.innerWidth, VH=window.innerHeight, out=[];
['dTipDot','djHelp','djFreshLink2','djMic'].forEach(id=>{
  const el=document.getElementById(id); if(!el) return;
  const r=el.getBoundingClientRect();
  if(r.width<2) return;
  // what is underneath the middle of this floating button?
  const cx=r.left+r.width/2, cy=r.top+r.height/2;
  const stack=document.elementsFromPoint(cx,cy).filter(e=>e!==el&&!el.contains(e));
  const under=stack[0];
  out.push({id, top:Math.round(r.top), right:Math.round(VW-r.right), bottom:Math.round(VH-r.bottom),
    size:[Math.round(r.width),Math.round(r.height)],
    covering: under? (under.tagName.toLowerCase()+(under.id?'#'+under.id:'')) : null,
    coveringText: under? (under.textContent||'').trim().slice(0,34) : null,
    coversSomething: !!(under && under!==document.body && under!==document.documentElement && (under.textContent||'').trim().length>0)});
});
// any two floating helpers on top of each other?
return {app:document.title.slice(0,34), vw:VW, floats:out};
})()
