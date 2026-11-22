import json,os,subprocess,urllib.request,wave,textwrap,sys
from PIL import Image,ImageDraw,ImageFont
D=os.environ.get('WHY_DIR','/tmp/whybuy')
SH='/home/user/daraja-apps/shop/shots/'; F='/usr/share/fonts/opentype/inter/'
def voice(tag,i,text,prev,nxt):
  out=f'{D}/{tag}_a{i:02d}.wav'
  if os.path.exists(out): return out
  req={'text':text,'model_id':'eleven_multilingual_v2','voice_settings':{'speed':1.0,'stability':0.6,'similarity_boost':0.6,'style':0.0,'use_speaker_boost':False}}
  if prev: req['previous_text']=prev
  if nxt: req['next_text']=nxt
  r=urllib.request.urlopen(urllib.request.Request('https://api.elevenlabs.io/v1/text-to-speech/FbDmiCefHcLYTtlx6nyc?output_format=pcm_24000',data=json.dumps(req).encode(),method='POST',headers={'xi-api-key':'dummy','Content-Type':'application/json'}),timeout=120).read()
  raw=out+'.raw.wav'
  with wave.open(raw,'wb') as f: f.setnchannels(1);f.setsampwidth(2);f.setframerate(24000);f.writeframes(r)
  subprocess.run(['ffmpeg','-nostdin','-y','-loglevel','error','-i',raw,'-af','atempo=1.07,apad=pad_dur=0.5','-ar','24000','-ac','1',out],check=True); os.remove(raw)
  return out
BG=(31,107,79); FG=(255,255,255)
def load(n): return Image.open(n if n.startswith('/') else SH+n).convert('RGB')
def rounded(s):
  m=Image.new('L',s.size,0); ImageDraw.Draw(m).rounded_rectangle([0,0,s.width,s.height],radius=28,fill=255); return m
def slide(tag,i,imgs,cap,W,H,head):
  im=Image.new('RGB',(W,H),BG); d=ImageDraw.Draw(im)
  d.text((W//2,int(H*0.055)),'daraja',font=ImageFont.truetype(F+'Inter-Bold.otf',int(W*0.06)),fill=FG,anchor='mm')
  top=int(H*0.1); area_h=int(H*(0.66 if imgs else 0)); 
  if head: d.text((W//2,top+20),head,font=ImageFont.truetype(F+'Inter-Bold.otf',int(W*0.05)),fill=(255,214,140),anchor='mm'); top+=int(W*0.08)
  if imgs:
    n=len(imgs); gap=24; avail_w=W-80
    cw=(avail_w-gap*(n-1))//n
    for k,nm in enumerate(imgs):
      s=load(nm); sc=min(cw/s.width,(area_h-40)/s.height); s=s.resize((int(s.width*sc),int(s.height*sc)))
      x=40+k*(cw+gap)+(cw-s.width)//2; im.paste(s,(x,top),rounded(s))
    y0=top+area_h+10; fs=int(W*0.05); wrap=int(W/fs*1.75)
  else: y0=int(H*0.42); fs=int(W*0.08); wrap=int(W/fs*1.7)
  f=ImageFont.truetype(F+'Inter-SemiBold.otf',fs)
  for k,l in enumerate(textwrap.wrap(cap,width=wrap)): d.text((W//2,y0+k*int(fs*1.3)),l,font=f,fill=FG,anchor='mm')
  p=f'{D}/{tag}_s{i:02d}.png'; im.save(p); return p
def build(tag,S,W,H,outname):
  parts=[]
  for i,(t,imgs,cap,head) in enumerate(S):
    a=voice(tag,i,t,S[i-1][0] if i else '',S[i+1][0] if i+1<len(S) else '')
    p=slide(tag,i,imgs,cap,W,H,head); v=f'{D}/{tag}_v{i:02d}.mp4'
    subprocess.run(['ffmpeg','-nostdin','-y','-loglevel','error','-loop','1','-i',p,'-i',a,'-c:v','libx264','-tune','stillimage','-pix_fmt','yuv420p','-r','30','-c:a','aac','-b:a','128k','-ar','44100','-shortest',v],check=True); parts.append(v)
  open(f'{D}/{tag}_list.txt','w').write(''.join(f"file '{p}'\n" for p in parts))
  subprocess.run(['ffmpeg','-nostdin','-y','-loglevel','error','-f','concat','-safe','0','-i',f'{D}/{tag}_list.txt','-c','copy',f'{D}/{outname}'],check=True)
STORE=D+'/store.jpg'
TOUR=[
 ("Why choose a Daraja app? Here's the whole store, and what the people who tested it said.",[STORE],"Simple apps for your home, your church, and the people you love","The Daraja store"),
 ("Testers in Kenya worked through every app for weeks. They rated them four point seven out of five, and three in four gave them nine or ten out of ten for recommending to a friend.",[],"Rated 4.7 out of 5 by our testers",None),
 ("Your household. Ahead of It keeps bills and renewals from sneaking up. Our Table plans the week's meals. The Key shows where everything is kept. And Who's Coming gets answers from a group. One tester said it saves time and stress.",["ahead.jpg","ourtable.jpg","thekey.jpg"],"“Saves time and stress.”","Your household"),
 ("Later life, and the people we love. Every Day and Rafiki help an older loved one through the day, and let family know they're okay, without disturbing them. In My Own Words keeps their stories for the grandchildren.",["everyday.jpg","rafiki.jpg","story-keeper.jpg"],"“Know how they're doing, without disturbing them.”","Later life & the people we love"),
 ("Your church. Serve Board keeps volunteers organized. Receipt Maker writes the donor letters in minutes, not a weekend. And Advent Together helps families prepare for Christmas, together.",["church-serve.jpg","np-receipts.jpg","advent.jpg"],"Volunteers, donors and Advent, sorted","Your church"),
 ("Your business, or nonprofit. Business Manager runs a one-truck business from your phone. Message Assistant helps write your posts. And Next Step Board keeps every project moving.",["business-manager.jpg","drumbeat.jpg","nextstep.jpg"],"Run the business from your phone","Your business or nonprofit"),
 ("Your own day. One Thing shows you just the one thing to do right now. A tester said it helps line up the jobs for everyone in the family.",["nownext.jpg"],"“It helps to align duties to everyone in the family.”","Your own day"),
 ("And free, for good. Compass helps you plan the next five years. Break-Even checks whether a price covers your costs. And My Safety Plan is there for the hard days.",["compass.jpg","breakeven.jpg","safety.jpg"],"Free, and for good","Free, and for good"),
 ("Every app is simple, works right on your phone, and keeps your information on your phone. They're free. And if one helps you, a small gift helps orphans and students in Kenya.",[],"Free · Private · Gifts help students in Kenya",None),
 ("Visit the Daraja store, and try one today.",[],"jerrywins1.github.io/daraja-apps/shop",None),
]
PROMO=[
 ("Simple apps for your home, your church, and the people you love.",[STORE],"Simple apps for your home, your church & the people you love",None),
 ("They're made to help you, and to raise money for orphans and a scholarship program in Kenya. Tested for weeks by real people, and rated four point seven out of five.",[],"Made to help you, and children in Kenya",None),
 ("Plan the week's meals. Never miss a bill. Keep your church volunteers organized. Check in on an aging parent.",["ourtable.jpg","ahead.jpg","church-serve.jpg","everyday.jpg"],"Meals · Bills · Volunteers · Family",None),
 ("No accounts, and no ads. Your information stays on your phone.",[],"No accounts. No ads. Stays on your phone.",None),
 ("Every app is free. If one helps you, a small gift goes to that work.",[],"Free — gifts help orphans & students in Kenya",None),
 ("Try one today, at the Daraja store.",[],"jerrywins1.github.io/daraja-apps/shop",None),
]
PROMO2=[
 ("Most apps wait for you to remember. Daraja apps think ahead for you.",[STORE],"Apps that think ahead for you",None),
 ("Each one works with the AI you already use: ChatGPT, Claude, or Gemini. The free versions work too.",[],"Works with the AI you already use",None),
 ("Family Money spots a big bill coming, weeks before it lands, and helps you plan for it while there's still time.",[],"Sees the big bills coming, weeks ahead","Family Money"),
 ("Ask it a real question, like, can we afford a new car? It asks what it needs to know, checks today's rates, and answers from your own budget.",[],"“Can we afford a new car?” — answered from your own budget","Family Money"),
 ("One Thing pulls the tasks out of a long email, and every Sunday helps you look back on your week, and ahead to the next one.",["nownext.jpg"],"Turns emails into tasks · Plans your week","One Thing"),
 ("Business Manager starts your day with a one minute brief, and writes the running late text for you.",["business-manager.jpg"],"A one-minute morning brief","Business Manager"),
 ("Your information stays on your phone. The AI only sees what you choose to share.",[],"Your information stays on your phone",None),
 ("They're free, and made to help you, and to raise money for orphans and a scholarship program in Kenya.",[],"Free · Made to help you, and children in Kenya",None),
 ("Try one today, at the Daraja store.",[],"jerrywins1.github.io/daraja-apps/shop",None),
]
PROMO3=[
 ("What if your phone already knew what your week needed?",[STORE],"What if your phone knew your week?",None),
 ("Meet Daraja. Simple apps, with an AI that works for you, and looks ahead for you.",[],"Meet Daraja · Apps that think ahead",None),
 ("It spots the big bill, three weeks before it lands. So you're ready, not surprised.",[],"Sees the big bill coming · 3 weeks early","Family Money"),
 ("Ask it anything. Can we afford a new car? It answers from your own numbers, not somebody else's.",[],"“Can we afford it?” — answered from your numbers","Family Money"),
 ("Run a business from your truck? Your whole day, briefed in one minute, before the first job.",["business-manager.jpg"],"Your day, briefed in one minute","Business Manager"),
 ("Not sure where to start? Tell the store about your week, and it picks the apps that fit you.",[],"Tell it about your week · It picks your apps",None),
 ("Got an idea? Say so, right inside any app. We're listening, and we build.",[],"Your idea, one tap away · We’re listening",None),
 ("No account. No subscription. Your information stays on your phone.",[],"No account · No subscription · Private",None),
 ("And it's free. Every gift helps orphans and students in Kenya.",[],"Free · Every gift helps children in Kenya",None),
 ("Daraja. Apps that think ahead. Get yours today.",[],"jerrywins1.github.io/daraja-apps/shop",None),
]
which=sys.argv[1]
if which=='tour': build('tour',TOUR,1080,1920,'Why Daraja - store tour draft 2.mp4')
elif which=='promo3': build('promo3',PROMO3,1080,1080,'Daraja - AI promo draft 3.mp4')
elif which=='promo2': build('promo2',PROMO2,1080,1080,'Daraja - AI promo draft 2.mp4')
else: build('promo',PROMO,1080,1080,'Daraja - Facebook promo draft 1.mp4')
print('ok')
