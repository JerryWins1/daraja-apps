(async()=>{
await new Promise(r=>setTimeout(r,1800));
const VW=window.innerWidth, VH=window.innerHeight;
function name(el){
  let n=el.tagName.toLowerCase();
  if(el.id) n+='#'+el.id;
  else if(el.className && typeof el.className==='string'){
    const c=el.className.trim().split(/\s+/).slice(0,2).join('.');
    if(c) n+='.'+c;
  }
  return n;
}
const over=[], small=[], tiny=[], clipped=[];
document.querySelectorAll('*').forEach(el=>{
  const r=el.getBoundingClientRect();
  if(r.width<2||r.height<2) return;
  const cs=getComputedStyle(el);
  if(cs.visibility==='hidden'||cs.display==='none'||+cs.opacity===0) return;
  // A · sticking out past the right edge
  if(cs.position!=='fixed' && (r.right>VW+1)){
    if(!el.querySelector('*') || r.width>VW+1)
      over.push({el:name(el), w:Math.round(r.width), right:Math.round(r.right), over:Math.round(r.right-VW), txt:(el.textContent||'').trim().slice(0,28)});
  }
  // B · text too small to read
  const fs=parseFloat(cs.fontSize);
  const own=[...el.childNodes].some(n=>n.nodeType===3 && n.textContent.trim().length>2);
  if(own && fs>0 && fs<13) small.push({el:name(el), px:Math.round(fs*10)/10, txt:(el.textContent||'').trim().slice(0,28)});
  // C · tap targets under 44
  if(/^(button|a|select)$/i.test(el.tagName) || el.getAttribute('role')==='button'){
    if(r.height>0 && r.height<40 && r.width>0)
      tiny.push({el:name(el), h:Math.round(r.height), w:Math.round(r.width), txt:(el.textContent||'').trim().slice(0,24)});
  }
  // D · a box whose own content does not fit inside it
  if(cs.overflow==='hidden'||cs.overflowX==='hidden'){
    if(el.scrollWidth>el.clientWidth+2 && el.clientWidth>40)
      clipped.push({el:name(el), inner:el.scrollWidth, box:el.clientWidth, txt:(el.textContent||'').trim().slice(0,28)});
  }
});
// E · anything a fixed bottom bar is sitting on top of
let covered=null;
const fixedBottom=[...document.querySelectorAll('*')].filter(el=>{
  const cs=getComputedStyle(el); if(cs.position!=='fixed') return false;
  const r=el.getBoundingClientRect(); return r.bottom>VH-4 && r.height>20 && r.width>VW*0.5;
});
if(fixedBottom.length){
  const bar=fixedBottom[0].getBoundingClientRect();
  covered={bar:name(fixedBottom[0]), barTop:Math.round(bar.top), barH:Math.round(bar.height)};
}
return {app:document.title.slice(0,40), vw:VW,
  scrollW:document.documentElement.scrollWidth, bodyW:document.body.scrollWidth,
  sideScroll:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-VW,
  overflow:over.slice(0,8), overflowN:over.length,
  smallText:small.slice(0,5), smallN:small.length,
  tinyTaps:tiny.slice(0,5), tinyN:tiny.length,
  clipped:clipped.slice(0,4), clippedN:clipped.length,
  bottomBar:covered};
})()
