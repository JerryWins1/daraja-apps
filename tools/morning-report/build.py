import sys,json
T,D,O=sys.argv[1:4]
d=json.dumps(json.load(open(D)),ensure_ascii=False).replace('</','<\\/')
open(O,'w').write(open(T).read().replace('__DATA__',d))
