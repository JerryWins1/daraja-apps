(async()=>{
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
await sleep(1600);
const VW=window.innerWidth, VH=window.innerHeight;

/* Get past any splash or welcome card first — the squeezing happens on the
   real screens behind it, which is where Jerry actually was. */
function fullCover(){
  return [...document.querySelectorAll('body *')].filter(el=>{
    const cs=getComputedStyle(el);
    if(cs.display==='none'||cs.visibility==='hidden'||+cs.opacity===0) return false;
    if(cs.position!=='fixed'&&cs.position!=='absolute') return false;
    const r=el.getBoundingClientRect();
    return r.width>VW*0.85 && r.height>VH*0.6 && r.top<40;
  });
}
let dismissed=[];
for(let pass=0; pass<3; pass++){
  const cov=fullCover(); if(!cov.length) break;
  const top=cov[cov.length-1];
  const btn=[...top.querySelectorAll('button,a')].find(b=>{
    const t=(b.textContent||'').trim();
    return t && /start|begin|got it|skip|look around|continue|let|open|ok|close|show me|no thanks|enter|go\b/i.test(t);
  }) || top.querySelector('button');
  if(!btn) break;
  dismissed.push((btn.textContent||'').trim().slice(0,26));
  btn.click(); await sleep(700);
}

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
document.querySelectorAll('body *').forEach(el=>{
  const r=el.getBoundingClientRect();
  if(r.width<2||r.height<2) return;
  const cs=getComputedStyle(el);
  if(cs.visibility==='hidden'||cs.display==='none'||+cs.opacity===0) return;
  if(r.right>VW+1 && r.width<=VW*1.6){
    if(!el.querySelector('*') || r.width>VW+1)
      over.push({el:name(el), w:Math.round(r.width), over:Math.round(r.right-VW), pos:cs.position, txt:(el.textContent||'').trim().slice(0,26)});
  }
  const fs=parseFloat(cs.fontSize);
  const own=[...el.childNodes].some(n=>n.nodeType===3 && n.textContent.trim().length>2);
  if(own && fs>0 && fs<13) small.push({el:name(el), px:Math.round(fs*10)/10, txt:(el.textContent||'').trim().slice(0,26)});
  if(/^(button|a|select)$/i.test(el.tagName) || el.getAttribute('role')==='button'){
    if(r.height>0 && r.height<40) tiny.push({el:name(el), h:Math.round(r.height), txt:(el.textContent||'').trim().slice(0,22)});
  }
  if((cs.overflow==='hidden'||cs.overflowX==='hidden') && el.scrollWidth>el.clientWidth+2 && el.clientWidth>40)
    clipped.push({el:name(el), inner:el.scrollWidth, box:el.clientWidth, txt:(el.textContent||'').trim().slice(0,26)});
});
return {app:document.title.slice(0,38), dismissed,
  sideScroll:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-VW,
  overflowN:over.length, overflow:over.slice(0,6),
  smallN:small.length, smallText:small.slice(0,4),
  tinyN:tiny.length, tinyTaps:tiny.slice(0,4),
  clippedN:clipped.length, clipped:clipped.slice(0,3)};
})()
