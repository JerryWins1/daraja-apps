#!/bin/bash
# Ready to Sell + morning digest, from the Jerry HQ sheet.
# usage: refresh.sh <Drive export file (tool-results JSON with the xlsx as base64)> [work dir] [since ISO for the digest]
# 1) export the sheet first: Google Drive download_file_content, fileId 1ezYrpd-ah47ws_MVaw_Jh8TqbFkwDWQ1T79QIiLrUEc,
#    exportMimeType application/vnd.openxmlformats-officedocument.spreadsheetml.sheet (it saves to a tool-results file)
# 2) run this; it writes <work>/ready_to_sell.html (publish it to the Ready to Sell artifact) and prints the digest.
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
WORK=${2:-/tmp/morning-report}; SINCE=${3:-$(date -u -d '-1 day' +%Y-%m-%dT%H:%M)}
REPO=$(git -C "$HERE" rev-parse --show-toplevel)
mkdir -p "$WORK"; rm -rf "$WORK/x"; mkdir -p "$WORK/x"
python3 -I - "$1" "$WORK/hq.xlsx" <<'PY'
import sys,json,re,base64
t=open(sys.argv[1]).read()
m=max(re.findall(r'[A-Za-z0-9+/=]{2000,}',t),key=len)
open(sys.argv[2],'wb').write(base64.b64decode(m))
PY
unzip -qo "$WORK/hq.xlsx" -d "$WORK/x"
# read app versions from the LIVE main branch without touching anyone's checkout
git -C "$REPO" fetch -q origin main || true
if [ -d "$WORK/main" ]; then git -C "$WORK/main" checkout -q --detach origin/main; else git -C "$REPO" worktree add -q --detach "$WORK/main" origin/main; fi
[ -f "$WORK/data.json" ] && cp "$WORK/data.json" "$WORK/data.prev.json"
python3 -I "$HERE/compute.py" "$WORK/x" "$WORK/main" "$WORK/data.json"
python3 -I "$HERE/build.py" "$HERE/template.html" "$WORK/data.json" "$WORK/ready_to_sell.html"
echo "page: $WORK/ready_to_sell.html"; echo
python3 -I "$HERE/digest.py" "$WORK/x" "$SINCE" "$WORK/data.json" $( [ -f "$WORK/data.prev.json" ] && echo "$WORK/data.prev.json" )
