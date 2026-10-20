# Ready-to-sell: reads the Jerry HQ sheet export (x/ unzipped xlsx dir) + the daraja-apps repo, writes data.json
import re, html, json, sys, os, collections, datetime, urllib.parse
X, REPO, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
ss=[html.unescape(re.sub('<[^>]+>','',m)) for m in re.findall(r'<si>(.*?)</si>',open(X+'/xl/sharedStrings.xml').read(),re.S)]
def rows(n):
    x=open(f'{X}/xl/worksheets/sheet{n}.xml').read(); out=[]
    for r in re.findall(r'<row[^>]*>(.*?)</row>',x,re.S):
        d={}
        for ref,attrs,body in re.findall(r'<c r="([A-Z]+)\d+"([^>]*?)(?:/>|>(.*?)</c>)',r,re.S):
            v=re.search(r'<v>(.*?)</v>',body or ''); t=re.search(r'<t[^>]*>(.*?)</t>',body or '',re.S)
            d[ref]=ss[int(v.group(1))] if v and 't="s"' in attrs else (v.group(1) if v else (html.unescape(t.group(1)) if t else ''))
        out.append(d)
    return out
# which sheet is messages: find by header
import glob
sheets={}
wb=open(X+'/xl/workbook.xml').read(); rels=open(X+'/xl/_rels/workbook.xml.rels').read()
for name,rid in re.findall(r'<sheet [^>]*name="([^"]+)"[^>]*r:id="([^"]+)"',wb):
    tgt=re.search(r'Id="%s"[^>]*Target="([^"]+)"'%rid,rels).group(1); sheets[name]=int(re.search(r'sheet(\d+)',tgt).group(1))
M=rows(sheets['messages'])
# app catalogue
k=open(REPO+'/kenya/index.html').read()
names={}
for key,nm,em in re.findall(r"(\w+):\['([^']+)','([^']+)'",k[k.find('var APPS_BASE'):k.find('var ROTATE_BASE')]+k[k.find("apps:{ porchlight"):k.find("apps:{ porchlight")+300]):
    if key in ('rotate','last','apps'): continue
    names[key]=(html.unescape(nm),em)
def ver_of(key):
    try: url=json.load(open(f'{REPO}/testers/scripts/{key}.json')).get('url','')
    except Exception: return None
    p=urllib.parse.unquote(urllib.parse.urlparse(url).path)
    if not p.startswith('/daraja-apps/'): return None
    f=REPO+p[len('/daraja-apps'):]; f=f+'index.html' if f.endswith('/') else f
    try: s=open(f,encoding='utf-8',errors='ignore').read()
    except Exception: return None
    vs=re.findall(r'v(\d+)\.(\d+)(?:\.(\d+))? · (20\d\d-\d\d-\d\d)',s)
    if not vs: return None
    best=max(vs,key=lambda t:(t[3],int(t[0]),int(t[1]),int(t[2] or 0)))
    return 'v%s.%s%s'%(best[0],best[1],('.'+best[2]) if best[2] else '')
A={}
dev=collections.defaultdict(set)
for d in M[1:]:
    txt=d.get('H',''); 
    if not (txt.startswith('KENYA|') or txt.startswith('FRIEND|')): continue
    line=txt.split('\n')[0]; f=line.split('|'); key=f[1]; who=(d.get('D') or '?').strip(); at=d.get('B','')
    kv={}
    for part in f[2:]:
        if ':' in part: a,b=part.split(':',1); kv[a]=b
    a=A.setdefault(key,{'reports':[]})
    m=re.match(r'(\d+)/(\d+) (PASS|FAIL)',kv.get('challenge',''))
    sf=re.search(r',(\d+) fail',kv.get('steps',''))
    rep={'who':who,'at':at[:16],'pass':bool(m and m.group(3)=='PASS'),'failsteps':int(sf.group(1)) if sf else 0,
         'ease':int(kv['ease']) if kv.get('ease','').isdigit() else None,'stuck':int(kv.get('stuck','0') or 0) if kv.get('stuck','').isdigit() else 0,
         'appv':kv.get('appv'),'device':kv.get('device'),'fs':kv.get('fs')=='1','edition':f[0]}
    a['reports'].append(rep)
    if rep['device']: dev[who].add(rep['device'])
apps=[]
for key in sorted(set(list(names)+list(A))):
    if key in ('home','index'): continue
    nm,em=names.get(key,(key,'📱')); cur=ver_of(key); reps=A.get(key,{'reports':[]})['reports']
    if not cur:
        seen=[r for r in reps if r['appv']]
        cur=max(seen,key=lambda r:r['at'])['appv'] if seen else None  # app lives outside this repo: trust the newest version testers saw
    on=[r for r in reps if cur and r['appv']==cur]; old=[r for r in reps if not (cur and r['appv']==cur)]
    passers=sorted({r['who'] for r in on if r['pass']}); oldpass=sorted({r['who'] for r in old if r['pass']})
    fails=sum(r['failsteps'] for r in on); eases=[r['ease'] for r in on if r['ease']]
    ease=round(sum(eases)/len(eases),1) if eases else None
    need=[]
    if len(passers)<2: need.append(f"{2-len(passers)} more tester{'s' if 2-len(passers)>1 else ''} to pass it on {cur or 'the current version'}")
    if fails: need.append(f"look at {fails} failed step{'s' if fails>1 else ''}")
    if ease is None: need.append('ease ratings')
    elif ease<4: need.append(f'make it easier (ease {ease} of 5)')
    status='ready' if not need else ('almost' if (len(passers)>=1 or len(oldpass)>=2) else 'needs')
    apps.append({'key':key,'name':nm,'em':em,'cur':cur,'status':status,'need':need,'passers':passers,'oldpass':oldpass,
                 'testers':sorted({r['who'] for r in reps}),'fails':fails,'oldfails':sum(r['failsteps'] for r in old),
                 'ease':ease,'stuck':sum(r['stuck'] for r in on),'fs':sum(1 for r in reps if r['fs']),
                 'last':max([r['at'] for r in reps] or ['']),'reports':len(reps)})
order={'ready':0,'almost':1,'needs':2}
apps.sort(key=lambda a:(order[a['status']],-len(a['passers']),-len(a['oldpass']),a['name']))
out={'updated':datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%d %H:%M UTC'),'apps':apps,'phones':{**{'Veronicah':['iPhone · 428px (earlier report)']},**{k:sorted(v) for k,v in sorted(dev.items())}},
     'counts':{s:sum(1 for a in apps if a['status']==s) for s in order}}
json.dump(out,open(OUT,'w'),ensure_ascii=False,indent=1)
print(out['counts'], len(apps),'apps'); print([ (a['name'],a['cur'],len(a['oldpass'])) for a in apps][:30])
