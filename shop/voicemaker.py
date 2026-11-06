#!/usr/bin/env python3
"""Record the narration for a video, from any machine.

    python3 shop/voicemaker.py hq firsttime apps rules
    python3 shop/voicemaker.py nownext overview train
    python3 shop/voicemaker.py --all-missing            # every video with no recording yet

Why this exists, in the player's own words (shop/watch.html, 7 Oct 2026):

    "Jerry on the iPad: the browser's own voice waited 10-15 s, repeated itself
     and stalled. A real recording plays the same on every device."

The first voicemaker lived on the Mac and used the Mac's own voice, so a video
could only be recorded sitting at that one laptop. Jerry, 6 Nov: "i will be
doing this remotely a lot so make it work everywhere." This one runs in a cloud
chat with no Mac in sight: the voice is Piper, a speech model that runs offline
once its file is here, and the only thing it ever fetches is that file.

What it writes, which is exactly what shop/watch.html reads:

  shop/voice/<app>-<mode>.m4a   one recording per video
  shop/voice/index.json         "<app>-<mode>": {file, cues, h}

A cue is [start, end, key] per line, in order, and the player checks three
things before it will use a recording: the cue count equals the line count, and
each cue's key equals vkey40() of that line, or that line alone falls back to
the browser voice. So the keys below are a port of the player's own vkey40 and
must stay in step with it. `h` is only a cache-buster on the audio's URL.

Needs: piper (pip install piper-tts) and ffmpeg. Both are checked for on the way
in, with the command to install them if they are missing.
"""

import argparse
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import tarfile
import tempfile
import urllib.request
import wave

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
VOICE_DIR = os.path.join(HERE, 'voice')
INDEX = os.path.join(VOICE_DIR, 'index.json')
APPS_JS = os.path.join(HERE, 'apps_data.js')

# The voice. Piper's own releases on GitHub, which a cloud session can reach;
# HuggingFace, where Piper looks by default, is blocked from ours.
VOICE_URL = 'https://github.com/rhasspy/piper/releases/download/v0.0.2/voice-en-us-lessac-medium.tar.gz'
VOICE_ONNX = 'en-us-lessac-medium.onnx'
MODEL_DIR = os.environ.get('PIPER_VOICE_DIR', os.path.join(tempfile.gettempdir(), 'daraja-piper'))

GAP = 0.25          # silence between lines, matching every recording made before this


# ── the player's own text handling, ported ────────────────────────────────────

def spoken(text):
    """watch.html speak(): what the voice actually says."""
    t = re.sub(r'\s+—\s+', '… ', str(text))
    t = re.sub(r'\s+·\s+', '… ', t)
    return t.replace('—', ',')


def vkey40(text):
    """watch.html vkey40(): the key a cue is matched on. Do not drift from it."""
    return re.sub(r'\s+', ' ', spoken(text)).strip()[:40]


def for_piper(text):
    """The same words, punctuated so the model pauses where a person would."""
    t = spoken(text).replace('…', ',')
    t = t.replace('’', "'").replace('“', '"').replace('”', '"')
    return re.sub(r'\s+', ' ', t).strip()


# ── the catalogue ─────────────────────────────────────────────────────────────

def load_apps():
    """APPS out of apps_data.js. It is JavaScript, so node reads it, not us."""
    if not shutil.which('node'):
        sys.exit('node is needed to read apps_data.js. Install Node, then run this again.')
    js = ('const fs=require("fs");'
          'const f=new Function(fs.readFileSync(%r,"utf8")+";return APPS;");'
          'process.stdout.write(JSON.stringify(f()));' % APPS_JS)
    out = subprocess.run(['node', '-e', js], capture_output=True, text=True)
    if out.returncode:
        sys.exit('apps_data.js did not parse:\n' + out.stderr.strip())
    return json.loads(out.stdout)


def lines_for(app, mode):
    """The lines of one video, the way watch.html picks them."""
    if mode == 'overview':
        got = app.get('lines')
    elif mode == 'train':
        got = app.get('train')
    else:
        got = (app.get('extra') or {}).get(mode, {}).get('lines')
    if not got:
        return None
    return [x if isinstance(x, str) else x.get('t', '') for x in got]


def every_video(apps):
    """(key, appkey, mode) for every video in the catalogue, real apps only."""
    out = []
    for k, a in apps.items():
        if k.startswith('tpl') or k.startswith('nourish'):
            continue
        if a.get('lines'):
            out.append((k + '-overview', k, 'overview'))
        if a.get('train'):
            out.append((k + '-train', k, 'train'))
        for m in (a.get('extra') or {}):
            out.append((k + '-' + m, k, m))
    return out


# ── the voice ─────────────────────────────────────────────────────────────────

def model_path():
    """The model file, fetched once and kept. Nothing else ever leaves the box."""
    path = os.path.join(MODEL_DIR, VOICE_ONNX)
    if os.path.exists(path) and os.path.exists(path + '.json'):
        return path
    os.makedirs(MODEL_DIR, exist_ok=True)
    print('Fetching the voice (about 58 MB, once) …', flush=True)
    tgz = os.path.join(MODEL_DIR, 'voice.tar.gz')
    try:
        with urllib.request.urlopen(VOICE_URL, timeout=180) as r, open(tgz, 'wb') as f:
            shutil.copyfileobj(r, f)
        with tarfile.open(tgz) as t:
            t.extractall(MODEL_DIR)
    except Exception as e:
        sys.exit('Could not fetch the voice: %s\n%s\nIf this machine cannot reach GitHub, copy\n'
                 '%s and %s.json into %s and run again.'
                 % (type(e).__name__, e, VOICE_ONNX, VOICE_ONNX, MODEL_DIR))
    finally:
        if os.path.exists(tgz):
            os.remove(tgz)
    if not os.path.exists(path):
        sys.exit('The voice archive did not contain %s.' % VOICE_ONNX)
    return path


def say(text, model, out_wav):
    r = subprocess.run(['piper', '-m', model, '-f', out_wav],
                       input=text, capture_output=True, text=True)
    if r.returncode or not os.path.exists(out_wav):
        sys.exit('piper failed on: %r\n%s' % (text[:60], r.stderr.strip()))


# ── stitching ─────────────────────────────────────────────────────────────────

def build(key, lines, model, work):
    """One wav per line, joined with GAP of silence. Returns (wav path, cues)."""
    segs = []
    for n, raw in enumerate(lines):
        w = os.path.join(work, '%03d.wav' % n)
        say(for_piper(raw), model, w)
        segs.append(w)

    params, frames, cues, at = None, [], [], 0.0
    for n, w in enumerate(segs):
        with wave.open(w, 'rb') as f:
            if params is None:
                params = f.getparams()
            data = f.readframes(f.getnframes())
            dur = f.getnframes() / float(f.getframerate())
        frames.append(data)
        cues.append([round(at, 3), round(at + dur, 3), vkey40(lines[n])])
        at += dur
        if n < len(segs) - 1:
            quiet = int(params.framerate * GAP) * params.sampwidth * params.nchannels
            frames.append(b'\0' * quiet)
            at += GAP

    joined = os.path.join(work, 'all.wav')
    with wave.open(joined, 'wb') as f:
        f.setparams(params)
        f.writeframes(b''.join(frames))
    return joined, cues


def encode(wav, m4a):
    """Keep the voice's own sample rate — resampling it only adds bytes."""
    with wave.open(wav, 'rb') as f:
        rate = f.getframerate()
    r = subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav,
                        '-c:a', 'aac', '-b:a', '48k', '-ar', str(rate), '-ac', '1', m4a],
                       capture_output=True, text=True)
    if r.returncode:
        sys.exit('ffmpeg failed:\n' + r.stderr.strip())


# ── main ──────────────────────────────────────────────────────────────────────

def main():
    p = argparse.ArgumentParser(description='Record a video’s narration.')
    p.add_argument('app', nargs='?', help='catalogue key, e.g. hq')
    p.add_argument('modes', nargs='*', help='overview, train, or an extra, e.g. firsttime')
    p.add_argument('--all-missing', action='store_true',
                   help='every video in the catalogue that has no recording yet')
    p.add_argument('--dry-run', action='store_true', help='say what it would record, record nothing')
    a = p.parse_args()

    for tool, how in (('piper', 'pip install piper-tts'), ('ffmpeg', 'apt-get install -y ffmpeg')):
        if not shutil.which(tool):
            sys.exit('%s is not on this machine. Install it with: %s' % (tool, how))

    apps = load_apps()
    index = {}
    if os.path.exists(INDEX):
        with open(INDEX, encoding='utf-8') as f:
            index = json.load(f)

    if a.all_missing:
        jobs = [(k, ak, m) for k, ak, m in every_video(apps) if k not in index]
    elif a.app and a.modes:
        jobs = [(a.app + '-' + m, a.app, m) for m in a.modes]
    else:
        p.error('give an app and at least one mode, or --all-missing')

    if not jobs:
        print('Nothing to record — every video already has one.')
        return

    print('%d to record: %s' % (len(jobs), ', '.join(k for k, _, _ in jobs)))
    if a.dry_run:
        return

    os.makedirs(VOICE_DIR, exist_ok=True)
    model = model_path()
    done = 0
    for key, appkey, mode in jobs:
        app = apps.get(appkey)
        if not app:
            print('  %s — no such app in the catalogue, skipped' % key)
            continue
        lines = lines_for(app, mode)
        if not lines:
            print('  %s — no lines for that mode, skipped' % key)
            continue
        print('  %s — %d lines' % (key, len(lines)), flush=True)
        with tempfile.TemporaryDirectory() as work:
            wav, cues = build(key, lines, model, work)
            m4a = os.path.join(VOICE_DIR, key + '.m4a')
            encode(wav, m4a)
        with open(m4a, 'rb') as f:
            h = hashlib.sha1(f.read()).hexdigest()[:8]
        index[key] = {'file': 'voice/%s.m4a' % key, 'cues': cues, 'h': h}
        print('     %.1f s, %s' % (cues[-1][1], os.path.basename(m4a)))
        done += 1

    with open(INDEX, 'w', encoding='utf-8') as f:
        json.dump(index, f, ensure_ascii=False)
        f.write('\n')
    print('Recorded %d. index.json now has %d.' % (done, len(index)))


if __name__ == '__main__':
    main()
