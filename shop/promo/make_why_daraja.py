import json,os,subprocess,urllib.request,wave,textwrap
from PIL import Image,ImageDraw,ImageFont
D=os.environ.get('WHY_DIR','/tmp/whybuy')
SH='/home/user/daraja-apps/shop/shots/'
F='/usr/share/fonts/opentype/inter/'
S=[
 ("Why choose a Daraja app? We asked the people who tested them.", None, "Why choose a Daraja app?"),
 ("Testers in Kenya worked through every app, step by step, for weeks, and told us honestly what they thought.", "home.jpg", "Tested for weeks, step by step"),
 ("They rated the apps four point seven out of five. And three in four gave them nine or ten out of ten for recommending to a friend.", None, "Rated 4.7 out of 5"),
 ("About One Thing, a tester wrote: it helps to line up the jobs for everyone in the family.", "nownext.jpg", "“It helps to align duties to everyone in the family.”"),
 ("About Our Table: you know clearly what to cook, and it saves time and stress.", "ourtable.jpg", "“Saves time and stress.”"),
 ("About Every Day: family can know how an older loved one is doing, without disturbing them.", "everyday.jpg", "“Know how they're doing, without disturbing them.”"),
 ("About The Key: family members know where everything is, so nothing gets lost.", "thekey.jpg", "“Helps to ensure nothing is lost.”"),
 ("About Ahead of It: you don't forget things like the insurance renewal, or tax to pay.", "ahead.jpg", "“Don't forget insurance renewal or tax to pay.”"),
 ("About Who's Coming: you get answers from a group, without any confusion.", "whoscoming.jpg", "“Get a response from a group without any confusion.”"),
 ("For churches, Serve Board keeps volunteers organized, and Receipt Maker writes the donor letters in minutes, not a weekend.", "church-serve.jpg", "Built for churches, too"),
 ("Every app is simple, works right on your phone, and keeps your information on your phone.", "jarbyjar.jpg", "Simple. On your phone. Private."),
 ("They're free. And if one helps you, a small gift helps orphans and students in Kenya.", None, "Free — gifts help students in Kenya"),
 ("Visit the Daraja store, and try one today.", None, "jerrywins1.github.io/daraja-apps/shop"),
]
def voice(i,text,prev,nxt):
  out=f'{D}/a{i:02d}.wav'
  if os.path.exists(out): return out
  req={'text':text,'model_id':'eleven_multilingual_v2','voice_settings':{'speed':1.0,'stability':0.6,'similarity_boost':0.6,'style':0.0,'use_speaker_boost':False}}
  if prev: req['previous_text']=prev
  if nxt: req['next_text']=nxt
  r=urllib.request.urlopen(urllib.request.Request('https://api.elevenlabs.io/v1/text-to-speech/FbDmiCefHcLYTtlx6nyc?output_format=pcm_24000',data=json.dumps(req).encode(),method='POST',headers={'xi-api-key':'dummy','Content-Type':'application/json'}),timeout=120).read()
  raw=out+'.raw.wav'
  with wave.open(raw,'wb') as f: f.setnchannels(1);f.setsampwidth(2);f.setframerate(24000);f.writeframes(r)
  subprocess.run(['ffmpeg','-nostdin','-y','-loglevel','error','-i',raw,'-af','atempo=1.07,apad=pad_dur=0.5','-ar','24000','-ac','1',out],check=True); os.remove(raw)
  return out
W,H=1080,1920; BG=(31,107,79); FG=(255,255,255)
def slide(i,img,cap):
  im=Image.new('RGB',(W,H),BG); d=ImageDraw.Draw(im)
  d.text((W//2,110),'daraja',font=ImageFont.truetype(F+'Inter-Bold.otf',64),fill=FG,anchor='mm')
  if img:
    s=Image.open(SH+img).convert('RGB'); sc=min(820/s.width,1250/s.height); s=s.resize((int(s.width*sc),int(s.height*sc)))
    m=Image.new('L',s.size,0); ImageDraw.Draw(m).rounded_rectangle([0,0,s.width,s.height],radius=36,fill=255)
    im.paste(s,((W-s.width)//2,190),m); y0=1520; fs=56
  else: y0=820; fs=88
  f=ImageFont.truetype(F+'Inter-SemiBold.otf',fs); lines=textwrap.wrap(cap,width=28 if fs==56 else 18)
  for k,l in enumerate(lines): d.text((W//2,y0+k*int(fs*1.3)),l,font=f,fill=FG,anchor='mm')
  p=f'{D}/s{i:02d}.png'; im.save(p); return p
parts=[]
for i,(t,img,cap) in enumerate(S):
  a=voice(i,t,S[i-1][0] if i else '',S[i+1][0] if i+1<len(S) else '')
  p=slide(i,img,cap)
  v=f'{D}/v{i:02d}.mp4'
  subprocess.run(['ffmpeg','-nostdin','-y','-loglevel','error','-loop','1','-i',p,'-i',a,'-c:v','libx264','-tune','stillimage','-pix_fmt','yuv420p','-r','30','-c:a','aac','-b:a','128k','-ar','44100','-shortest',v],check=True)
  parts.append(v)
open(f'{D}/list.txt','w').write(''.join(f"file '{p}'\n" for p in parts))
subprocess.run(['ffmpeg','-nostdin','-y','-loglevel','error','-f','concat','-safe','0','-i',f'{D}/list.txt','-c','copy',f'{D}/Why Daraja - draft.mp4'],check=True)
print('done')
