(async()=>{
const S=ms=>new Promise(r=>setTimeout(r,ms));
await S(2800);
const VW=innerWidth, VH=innerHeight;
/* get past a splash so we measure the real screens */
for(let pass=0;pass<3;pass++){
  const cov=[...document.querySelectorAll('body *')].filter(el=>{const cs=getComputedStyle(el); if(cs.display==='none'||cs.visibility==='hidden'||+cs.opacity===0)return false; if(cs.position!=='fixed'&&cs.position!=='absolute')return false; const r=el.getBoundingClientRect(); return r.width>VW*.85&&r.height>VH*.6&&r.top<40;});
  if(!cov.length) break;
  const top=cov[cov.length-1];
  const btn=[...top.querySelectorAll('button,a')].find(b=>/start|begin|got it|skip|look around|continue|let|open|ok|close|show me|no thanks|enter|go\b/i.test((b.textContent||'').trim()))||top.querySelector('button');
  if(!btn) break; btn.click(); await S(600);
}
const F=[]; const add=(cat,sev,el,detail)=>F.push({cat,sev,el:name(el),detail});
function name(el){ if(!el||!el.tagName) return '?'; let n=el.tagName.toLowerCase(); if(el.id) n+='#'+el.id; else if(typeof el.className==='string'&&el.className.trim()) n+='.'+el.className.trim().split(/\s+/)[0]; const t=(el.textContent||'').trim().replace(/\s+/g,' ').slice(0,28); return t? n+' “'+t+'”' : n; }
function vis(el){ const cs=getComputedStyle(el); if(cs.display==='none'||cs.visibility==='hidden'||+cs.opacity===0) return false; const r=el.getBoundingClientRect(); return r.width>1&&r.height>1; }
function lum(c){ const m=c.match(/[\d.]+/g); if(!m) return null; const [r,g,b]=m.map(Number); const a=m[3]!==undefined?+m[3]:1; if(a<0.5) return null; const f=v=>{v/=255; return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)}; return .2126*f(r)+.7152*f(g)+.0722*f(b); }
function bgOf(el){ let e=el; while(e&&e!==document.documentElement){ const c=getComputedStyle(e).backgroundColor; const m=c.match(/[\d.]+/g); if(m&&(m[3]===undefined||+m[3]>=.5)) return c; e=e.parentElement; } return getComputedStyle(document.body).backgroundColor||'rgb(255,255,255)'; }
const ids={}; document.querySelectorAll('[id]').forEach(e=>{ids[e.id]=(ids[e.id]||0)+1;});
Object.entries(ids).forEach(([k,v])=>{ if(v>1) add('dup-id','warn',document.getElementById(k),'id "'+k+'" used '+v+' times'); });
let lastH=0;
const all=[...document.querySelectorAll('body *')];
for(const el of all){
  if(!vis(el)) continue;
  const cs=getComputedStyle(el), r=el.getBoundingClientRect(), tag=el.tagName.toLowerCase();
  const own=[...el.childNodes].filter(n=>n.nodeType===3&&n.textContent.trim().length>1).map(n=>n.textContent.trim()).join(' ');
  /* text */
  if(own){
    const fs=parseFloat(cs.fontSize);
    if(fs<13) add('small-text','warn',el,fs.toFixed(1)+'px');
    const lh=parseFloat(cs.lineHeight); if(!isNaN(lh)&&lh/fs<1.25&&own.length>40) add('tight-lines','info',el,'line-height '+(lh/fs).toFixed(2));
    const L1=lum(cs.color), L2=lum(bgOf(el));
    if(L1!=null&&L2!=null){ const ratio=(Math.max(L1,L2)+.05)/(Math.min(L1,L2)+.05); const big=fs>=24||(fs>=18.66&&+cs.fontWeight>=700); const need=big?3:4.5; if(ratio<need) add('low-contrast', ratio<3?'bad':'warn', el, ratio.toFixed(1)+':1 (needs '+need+')'); }
    if(/\bclick\b/i.test(own)&&!/tap/i.test(own)) add('says-click','info',el,'"click" on a phone — say tap');
    if(own.length>2&&own===own.toUpperCase()&&/[A-Z]{6,}/.test(own)&&cs.textTransform!=='uppercase'&&own.length>14) add('shouting-caps','info',el,'typed in capitals');
    if(r.width>VW*.9&&own.length>90&&fs<=16) add('long-lines','info',el,Math.round(r.width/(fs*.5))+' chars per line');
  }
  /* headings order */
  if(/^h[1-6]$/.test(tag)){ const n=+tag[1]; if(lastH&&n>lastH+1) add('heading-skip','info',el,'h'+lastH+' → h'+n); lastH=n; }
  /* interactive */
  const isBtn=tag==='button'||tag==='a'||el.getAttribute('role')==='button'||tag==='select'||(tag==='input'&&/^(button|submit|checkbox|radio)$/.test(el.type));
  if(isBtn){
    if(r.height<40||r.width<40) add('tiny-tap','warn',el,Math.round(r.width)+'×'+Math.round(r.height));
    const lbl=(el.getAttribute('aria-label')||el.getAttribute('title')||el.textContent||'').trim();
    const emojiOnly=/^[\p{Extended_Pictographic}\s️]+$/u.test((el.textContent||'').trim());
    if(!lbl||emojiOnly&&!el.getAttribute('aria-label')) add('no-name','bad',el,'no words a screen reader can say');
    if(tag==='a'&&/^(here|click here|more|link|read more)$/i.test(lbl)) add('vague-link','info',el,'"'+lbl+'"');
    if(tag==='a'&&!el.getAttribute('href')) add('dead-link','warn',el,'link with no address');
    if(cs.outlineStyle==='none'&&!/focus-visible/.test(document.documentElement.innerHTML.slice(0,0))) {/* checked globally below */}
  }
  /* inputs */
  if(tag==='input'||tag==='textarea'||tag==='select'){
    if(!/^(hidden|button|submit|checkbox|radio)$/.test(el.type||'')){
      const id=el.id, hasLabel=(id&&document.querySelector('label[for="'+CSS.escape(id)+'"]'))||el.closest('label')||el.getAttribute('aria-label')||el.getAttribute('aria-labelledby');
      if(!hasLabel) add('no-label', el.placeholder?'warn':'bad', el, el.placeholder?'placeholder only — vanishes when you type':'nothing tells you what goes here');
      if(parseFloat(cs.fontSize)<16) add('zoom-box','warn',el,'under 16px — iPhone zooms in');
      if(el.type==='tel'&&!el.autocomplete) add('no-autofill','info',el,'tel without autocomplete');
      if(el.type==='email'&&!el.autocomplete) add('no-autofill','info',el,'email without autocomplete');
      if(el.type==='number'&&!el.inputMode) add('no-inputmode','info',el,'number box without a numeric keypad hint');
      if(r.height<40) add('short-box','warn',el,Math.round(r.height)+'px tall');
    }
  }
  if(tag==='img'&&!el.hasAttribute('alt')) add('no-alt','warn',el,'image with no alt');
  /* geometry */
  if(cs.position!=='fixed'&&r.right>VW+2&&r.width<=VW*1.5) add('off-edge','bad',el,Math.round(r.right-VW)+'px past the right edge');
  if(r.left<-2&&r.width>20) add('off-edge','bad',el,Math.round(-r.left)+'px past the left edge');
  if((cs.overflow==='hidden'||cs.overflowX==='hidden')&&el.scrollWidth>el.clientWidth+3&&el.clientWidth>40&&own) add('clipped-text','warn',el,'words cut off');
  if(cs.textOverflow==='ellipsis'&&el.scrollWidth>el.clientWidth+2) add('ellipsis','info',el,'shortened with …');
}
/* page-level */
if(!document.documentElement.lang) add('no-lang','info',document.documentElement,'no language set');
const vp=document.querySelector('meta[name=viewport]'); if(!vp) add('no-viewport','bad',document.head,'no viewport meta'); else if(/user-scalable=no|maximum-scale=1(\D|$)/.test(vp.content)) add('no-zoom','warn',vp,'pinch-to-zoom blocked');
if(!/\bv\d+\.\d+/.test(document.body.innerText)) add('no-version','warn',document.body,'no version stamp on the page');
if(!document.querySelector('h1')) add('no-h1','info',document.body,'no main heading');
const sideScroll=Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-VW; if(sideScroll>2) add('side-scroll','bad',document.body,sideScroll+'px sideways scroll');
const fixed=all.filter(e=>vis(e)&&getComputedStyle(e).position==='fixed').map(e=>({e,r:e.getBoundingClientRect()})).filter(x=>x.r.width>20&&x.r.height>20&&x.r.width<VW*.95);
for(let i=0;i<fixed.length;i++)for(let j=i+1;j<fixed.length;j++){const a=fixed[i].r,b=fixed[j].r; if(!(a.right<=b.left||b.right<=a.left||a.bottom<=b.top||b.bottom<=a.top)&&!fixed[i].e.contains(fixed[j].e)&&!fixed[j].e.contains(fixed[i].e)) add('float-overlap','warn',fixed[i].e,'sits on '+name(fixed[j].e));}
const cats={}; F.forEach(f=>{cats[f.cat]=(cats[f.cat]||0)+1;});
return {app:document.title.slice(0,40), url:location.pathname, total:F.length, cats, findings:F.slice(0,400)};
})()
