#!/usr/bin/env python3
"""Record the narration for a video, from any machine.

    python3 shop/voicemaker.py hq firsttime apps rules
    python3 shop/voicemaker.py nownext overview train
    python3 shop/voicemaker.py --all-missing            # every video with no recording yet
    VOICE=elevenlabs python3 shop/voicemaker.py --splice nownext overview
                                    # re-record only the new or reworded lines (see splice())

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

A cue is [start, end, key40, linehash] per line, in order, and the player
checks the cue count against the line count, then each line against the cue:
on linehash where a cue has one, on the older truncated key40 where it does
not, and a line that does not match falls back to the browser voice on its own.
So both key functions below are a port of the player's and must stay in step
with it. READ vkey40()'s OWN NOTE BEFORE TRUSTING --check on an old recording:
key40 sees only the first forty characters of a line, which is why linehash
exists. `h` is only a cache-buster on the audio's URL.

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
import time
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
    """watch.html vkey40(): the key a cue WAS matched on. Do not drift from it.

    IT ONLY LOOKS AT THE FIRST FORTY CHARACTERS, and that is a trap, not a
    detail. Found 8 Nov 2026 by the Ahead of It chat, after one of its own
    videos spoke the old words under a new caption and --check called it
    current. Reword a line after character forty and this key does not move:
    --check saw no mismatch, --all skipped the line because it believed it was
    already recorded, and the player happily played audio of the old sentence.

    So a cue now carries a FOURTH field, linehash() of the whole line, and that
    is what decides whether a recording still matches its script. vkey40 stays
    only to read the 141 recordings made before this (8 Nov 2026) — 2,360 of
    their 2,384 cue keys are truncated, so switching them to a whole-line key
    would have dropped every video in the store back to the browser voice that
    stalls on an iPad. They keep playing and --check calls them UNVERIFIED
    rather than current, which is the truth: their openings match and nobody
    knows about the rest. Each becomes fully checked the next time it is
    recorded, so this fades out on its own.

    If you are standing here because --check told you everything was fine:
    on a recording with no fourth field, "current" means only that the first
    forty characters of each line still match. Re-record it by name.
    """
    return re.sub(r'\s+', ' ', spoken(text)).strip()[:40]


def vfull(text):
    """vkey40 without the truncation — the whole line, as the voice says it."""
    return re.sub(r'\s+', ' ', spoken(text)).strip()


def linehash(text):
    """A short, stable fingerprint of a whole line. Mirrored in shop/watch.html.

    FNV-1a over the UTF-8 bytes, so Python and the browser agree without
    either needing a crypto library (crypto.subtle is async and a cue check
    has to be synchronous). Eight hex characters per cue adds about 26 KB to
    index.json; storing the lines themselves would have added 190 KB to a file
    the player fetches on every watch page.
    """
    h = 0x811c9dc5
    for b in vfull(text).encode('utf-8'):
        h = ((h ^ b) * 0x01000193) & 0xFFFFFFFF
    return '%08x' % h


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
    if mode == 'explain':
        return None   # handled by explain_lines, which does not need the catalogue
    if mode == 'overview':
        got = app.get('lines')
    elif mode == 'train':
        got = app.get('train')
    else:
        got = (app.get('extra') or {}).get(mode, {}).get('lines')
    if not got:
        return None
    return [x if isinstance(x, str) else x.get('t', '') for x in got]


KENYA_DIR = os.path.join(HERE, 'kenya')


def explain_lines(appkey):
    """?mode=explain reads shop/kenya/<app>.json, and 'tester' means kickoff.json —
    the same rule watch.html follows. Files starting with _ are not served."""
    name = 'kickoff' if appkey == 'tester' else appkey
    path = os.path.join(KENYA_DIR, name + '.json')
    if not os.path.exists(path):
        return None
    with open(path, encoding='utf-8') as f:
        d = json.load(f)
    got = (d.get('explainer') or {}).get('lines') or d.get('lines')
    if not got:
        return None
    return [x if isinstance(x, str) else x.get('t', '') for x in got]


def lines_of(apps, appkey, mode):
    """The lines of one video, whichever file they live in."""
    if mode == 'explain':
        return explain_lines(appkey)
    app = apps.get(appkey)
    return lines_for(app, mode) if app else None


def every_video(apps):
    """(key, appkey, mode) for every video there is, real apps only."""
    out = []
    for k, a in sorted(apps.items()):
        if k.startswith('tpl') or k.startswith('nourish'):
            continue
        if a.get('lines'):
            out.append((k + '-overview', k, 'overview'))
        if a.get('train'):
            out.append((k + '-train', k, 'train'))
        for m in (a.get('extra') or {}):
            out.append((k + '-' + m, k, m))
    seen = {x[1] for x in out}
    for fn in sorted(os.listdir(KENYA_DIR)) if os.path.isdir(KENYA_DIR) else []:
        if not fn.endswith('.json') or fn.startswith('_'):
            continue
        appkey = 'tester' if fn == 'kickoff.json' else fn[:-5]
        if explain_lines(appkey):
            out.append((appkey + '-explain', appkey, 'explain'))
        seen.add(appkey)
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


# 19 Nov 2026: Jerry's own voice. With VOICE=elevenlabs each line is read by his
# "Jerry W" clone on ElevenLabs instead of piper. The chat's environment holds the
# key as a network secret for api.elevenlabs.io, so the proxy adds it and this file
# only ever sends a dummy. Speed 1.15 is what he chose: his voice runs slow and low.
ENGINE = os.environ.get('VOICE', 'piper')
EL_VOICE = os.environ.get('EL_VOICE', 'FbDmiCefHcLYTtlx6nyc')
EL_RATE = 24000
# 19 Nov, Jerry, after hearing 1.15: "just a tad too fast … one phrase turns into the
# next". So a touch slower, a short breath between sentences inside a line, and a
# longer pause between lines, which is where the topic usually turns.
EL_SPEED = 1.07
EL_GAP = 0.4
EL_BREATH = ''   # break tags made it choppy; the model's own sentence pauses are smoother


def el_text(text):
    if not EL_BREATH:
        return text
    return re.sub(r'([.!?])\s+(?=\S)', r'\1 ' + EL_BREATH + ' ', text)


def say_elevenlabs(text, out_wav, prev='', nxt=''):
    # previous_text / next_text: each line is still its own clip (the captions need
    # that), but ElevenLabs hears the lines either side, so a line no longer starts
    # and ends like a fresh announcement. Jerry, 19 Nov: "choppy … the word starts
    # off and ends in too many pronunciations". Steadier settings for the same reason.
    req = {'text': el_text(text), 'model_id': 'eleven_multilingual_v2',
           'voice_settings': {'speed': 1.0, 'stability': 0.6, 'similarity_boost': 0.6,
                              'style': 0.0, 'use_speaker_boost': False}}
    if prev:
        req['previous_text'] = prev
    if nxt:
        req['next_text'] = nxt
    body = json.dumps(req).encode()
    url = ('https://api.elevenlabs.io/v1/text-to-speech/%s?output_format=pcm_%d'
           % (EL_VOICE, EL_RATE))
    for attempt in range(4):
        req = urllib.request.Request(url, data=body, method='POST', headers={
            'xi-api-key': 'dummy', 'Content-Type': 'application/json'})
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                pcm = r.read()
            break
        except Exception as e:
            if attempt == 3:
                sys.exit('ElevenLabs failed on: %r\n%s' % (text[:60], e))
            time.sleep(3 * (attempt + 1))
    raw = out_wav + '.raw.wav'
    with wave.open(raw, 'wb') as f:
        f.setnchannels(1); f.setsampwidth(2); f.setframerate(EL_RATE)
        f.writeframes(pcm)
    # Read at his natural speed, then quickened by EL_SPEED. Asking the model itself to
    # speak faster clipped the ends of words (Jerry, 19 Nov: "word endings").
    r = subprocess.run(['ffmpeg', '-nostdin', '-y', '-loglevel', 'error', '-i', raw,
                        '-af', 'atempo=%.3f' % EL_SPEED, '-ar', str(EL_RATE), '-ac', '1', out_wav],
                       stdin=subprocess.DEVNULL, capture_output=True, text=True)
    os.remove(raw)
    if r.returncode:
        sys.exit('ffmpeg failed:\n' + r.stderr.strip())


def say(text, model, out_wav):
    if ENGINE == 'elevenlabs':
        return say_elevenlabs(text, out_wav)
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
        if ENGINE == 'elevenlabs':
            say_elevenlabs(for_piper(raw), w,
                           for_piper(lines[n - 1]) if n else '',
                           for_piper(lines[n + 1]) if n + 1 < len(lines) else '')
        else:
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
        cues.append([round(at, 3), round(at + dur, 3), vkey40(lines[n]), linehash(lines[n])])
        at += dur
        if n < len(segs) - 1:
            quiet = int(params.framerate * (EL_GAP if ENGINE == 'elevenlabs' else GAP)) * params.sampwidth * params.nchannels
            frames.append(b'\0' * quiet)
            at += EL_GAP if ENGINE == 'elevenlabs' else GAP

    joined = os.path.join(work, 'all.wav')
    with wave.open(joined, 'wb') as f:
        f.setparams(params)
        f.writeframes(b''.join(frames))
    return joined, cues


# ── splicing: re-record only the lines that changed ──────────────────────────
#
# 21 Nov 2026. Jerry asked for one new line in 103 videos. Re-recording every one
# whole in his ElevenLabs voice would have cost about 235,000 characters, more than
# the credits left. So --splice keeps the audio of every line whose words are
# unchanged, cut out of the existing m4a at its own cue times, and synthesises only
# the lines that are new or reworded. The join uses the same gap as build(), and the
# cues are written the normal way, so the player cannot tell a spliced video from a
# whole one.
#
# It refuses a recording that is not in the same voice (an ElevenLabs recording is
# 24 kHz; piper and older voices are not), because a splice would put two voices in
# one video. Record that one whole, by name, instead.
#
# A new line's clip is cached by its fingerprint in SPLICE_CACHE, so a sentence that
# appears in four of one app's videos is paid for once.

SPLICE_CACHE = os.environ.get('SPLICE_CACHE', os.path.join(tempfile.gettempdir(), 'daraja-el-lines'))


def decode(m4a, rate):
    """The old recording as mono 16-bit pcm at `rate`, plus its frame count."""
    r = subprocess.run(['ffmpeg', '-nostdin', '-loglevel', 'error', '-i', m4a,
                        '-f', 's16le', '-ac', '1', '-ar', str(rate), '-'],
                       stdin=subprocess.DEVNULL, capture_output=True)
    if r.returncode:
        sys.exit('ffmpeg could not read %s:\n%s' % (m4a, r.stderr.decode(errors='replace')))
    return r.stdout


def splice(key, lines, old, work):
    """Like build(), but reuses old audio for unchanged lines. Returns (wav, cues, new_count)."""
    if ENGINE != 'elevenlabs':
        sys.exit('--splice is only for VOICE=elevenlabs recordings.')
    src = os.path.join(HERE, old['file'])
    rate = int(subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'a:0', '-show_entries',
                               'stream=sample_rate', '-of', 'csv=p=0', src],
                              capture_output=True, text=True).stdout.strip() or 0)
    if rate != EL_RATE:
        sys.exit('%s is %d Hz, not an ElevenLabs recording — splicing would mix two voices. '
                 'Record it whole, by name, without --splice.' % (key, rate))
    pcm = decode(src, EL_RATE)
    have = len(pcm) // 2 / float(EL_RATE)
    if abs(have - old['cues'][-1][1]) > 0.25:
        sys.exit('%s: the audio is %.2f s but its cues end at %.2f s — will not cut from it.'
                 % (key, have, old['cues'][-1][1]))

    pool = {}
    for c in old['cues']:
        if len(c) > 3:
            pool.setdefault(c[3], []).append(c)
    os.makedirs(SPLICE_CACHE, exist_ok=True)

    clips, fresh = [], 0
    for n, raw in enumerate(lines):
        h = linehash(raw)
        if pool.get(h):
            c = pool[h].pop(0)
            a, b = int(round(c[0] * EL_RATE)) * 2, int(round(c[1] * EL_RATE)) * 2
            clips.append(pcm[a:b])
            continue
        cached = os.path.join(SPLICE_CACHE, '%s-%s.wav' % (EL_VOICE, h))
        if not os.path.exists(cached):
            say_elevenlabs(for_piper(raw), cached + '.tmp.wav',
                           for_piper(lines[n - 1]) if n else '',
                           for_piper(lines[n + 1]) if n + 1 < len(lines) else '')
            os.replace(cached + '.tmp.wav', cached)
            print('     new line %d synthesised' % n, flush=True)
        else:
            print('     new line %d from cache' % n, flush=True)
        with wave.open(cached, 'rb') as f:
            if f.getframerate() != EL_RATE or f.getnchannels() != 1 or f.getsampwidth() != 2:
                sys.exit('cached clip %s is not 24 kHz mono 16-bit' % cached)
            clips.append(f.readframes(f.getnframes()))
        fresh += 1

    frames, cues, at = [], [], 0.0
    quiet = b'\0' * (int(EL_RATE * EL_GAP) * 2)
    for n, data in enumerate(clips):
        dur = len(data) // 2 / float(EL_RATE)
        frames.append(data)
        cues.append([round(at, 3), round(at + dur, 3), vkey40(lines[n]), linehash(lines[n])])
        at += dur
        if n < len(clips) - 1:
            frames.append(quiet)
            at += EL_GAP
    joined = os.path.join(work, 'all.wav')
    with wave.open(joined, 'wb') as f:
        f.setnchannels(1); f.setsampwidth(2); f.setframerate(EL_RATE)
        f.writeframes(b''.join(frames))
    return joined, cues, fresh


def encode(wav, m4a):
    """Keep the voice's own sample rate — resampling it only adds bytes."""
    with wave.open(wav, 'rb') as f:
        rate = f.getframerate()
    # -nostdin and stdin=DEVNULL: ffmpeg reads the terminal for keystrokes by default,
    # so inside a `while read` loop it swallowed the loop's own list. On 8 Nov 2026 that
    # skipped 101 of 133 re-recordings and failed Pit Wall with "nothing was written".
    r = subprocess.run(['ffmpeg', '-nostdin', '-y', '-loglevel', 'error', '-i', wav,
                        '-c:a', 'aac', '-b:a', '40k', '-ar', str(rate), '-ac', '1', m4a],
                       stdin=subprocess.DEVNULL, capture_output=True, text=True)
    if r.returncode:
        sys.exit('ffmpeg failed:\n' + r.stderr.strip())


def audit(apps, index):
    """Every video, sorted into recorded / never recorded / reworded since.

    Four buckets, not three. A recording only counts if the cue count equals
    the line count AND every line still matches, because that is what
    watch.html checks before it will use one. Reword a single line and the
    whole video drops back to the browser voice with nothing on screen to say
    so — which is how twelve of them went quiet without anyone noticing.

    UNVERIFIED is the fourth, and it exists because of the vkey40 trap written
    up beside that function: a recording made before 8 Nov 2026 can only be
    checked on the first forty characters of each line. Calling those
    "current" is what let a video speak the old words under a new caption, so
    they are counted apart from the ones that are genuinely known to match.
    Each one leaves this bucket the next time it is recorded."""
    good, missing, stale, unverified = [], [], [], []
    for key, appkey, mode in every_video(apps):
        lines = lines_of(apps, appkey, mode)
        if not lines:
            continue
        v = index.get(key)
        if not v:
            missing.append((key, appkey, mode, '%d lines, never recorded' % len(lines)))
        elif not os.path.exists(os.path.join(HERE, v['file'])):
            stale.append((key, appkey, mode, 'the audio file is gone'))
        elif len(v['cues']) != len(lines):
            stale.append((key, appkey, mode, '%d cues, %d lines' % (len(v['cues']), len(lines))))
        elif all(len(c) > 3 for c in v['cues']):
            off = [n for n, l in enumerate(lines) if v['cues'][n][3] != linehash(l)]
            if off:
                stale.append((key, appkey, mode, '%d line(s) reworded since' % len(off)))
            else:
                good.append(key)
        else:
            off = [n for n, l in enumerate(lines) if v['cues'][n][2] != vkey40(l)]
            if off:
                stale.append((key, appkey, mode, '%d line(s) reworded since' % len(off)))
            else:
                unverified.append((key, appkey, mode,
                                   'recorded before the whole-line check — only the first 40 '
                                   'characters of each line are known to match'))
    return good, missing, stale, unverified


# ── main ──────────────────────────────────────────────────────────────────────

def main():
    p = argparse.ArgumentParser(description='Record a video’s narration.')
    p.add_argument('app', nargs='?', help='catalogue key, e.g. hq')
    p.add_argument('modes', nargs='*', help='overview, train, or an extra, e.g. firsttime')
    p.add_argument('--all-missing', action='store_true',
                   help='every video that has no recording yet')
    p.add_argument('--all', action='store_true',
                   help='every video that has no recording OR whose words changed since')
    p.add_argument('--check', action='store_true',
                   help='say which videos are recorded, missing or out of date; record nothing')
    p.add_argument('--dry-run', action='store_true', help='say what it would record, record nothing')
    p.add_argument('--splice', action='store_true',
                   help='keep the old audio of unchanged lines; synthesise only new or reworded ones '
                        '(VOICE=elevenlabs only — see splice())')
    a = p.parse_args()

    for tool, how in ((('piper', 'pip install piper-tts'),) if ENGINE != 'elevenlabs' else ()) + (('ffmpeg', 'apt-get install -y ffmpeg'),):
        if not shutil.which(tool):
            sys.exit('%s is not on this machine. Install it with: %s' % (tool, how))

    apps = load_apps()
    index = {}
    if os.path.exists(INDEX):
        with open(INDEX, encoding='utf-8') as f:
            index = json.load(f)

    good, missing, stale, unverified = audit(apps, index)

    if a.check:
        still = []
        for key, appkey, mode in every_video(apps):
            if mode == 'explain':
                continue   # its lines live in shop/kenya/ and carry no scene direction
            lines = (apps[appkey].get('lines') if mode == 'overview'
                     else apps[appkey].get('train') if mode == 'train'
                     else (apps[appkey].get('extra') or {}).get(mode, {}).get('lines')) or []
            if lines and not any(isinstance(l, dict) and l.get('js') for l in lines):
                still.append((key, len(lines)))

        print('%3d recorded and current, whole line checked' % len(good))
        print('%3d never recorded' % len(missing))
        for k, _, _, why in missing:
            print('     %-28s %s' % (k, why))
        print('%3d out of date' % len(stale))
        for k, _, _, why in stale:
            print('     %-28s %s' % (k, why))
        print('%3d UNVERIFIED — recorded before 8 Nov 2026' % len(unverified))
        if unverified:
            print('     Only the first 40 characters of each line are known to match, so one of')
            print('     these can be speaking words that were edited later. Re-record it BY NAME')
            print('     to settle it; --all will not pick it up. See vkey40() in this file.')
        if missing or stale:
            print('\nRecord them with: python3 shop/voicemaker.py --all')
        if still:
            print('\n%3d never change the screen — rule 1 in apps_data.js says the screen follows' % len(still))
            print('    the story, so these need js on the lines that talk about a screen:')
            for k, n in sorted(still, key=lambda x: -x[1]):
                print('     %-28s %d lines, no scene direction' % (k, n))
        return

    if a.all:
        jobs = [(k, ak, m) for k, ak, m, _ in missing + stale]
    elif a.all_missing:
        jobs = [(k, ak, m) for k, ak, m, _ in missing]
    elif a.app and a.modes:
        jobs = [(a.app + '-' + m, a.app, m) for m in a.modes]
    else:
        p.error('give an app and at least one mode, or --all, --all-missing or --check')

    if not jobs:
        print('Nothing to record — every video already has one.')
        return

    print('%d to record: %s' % (len(jobs), ', '.join(k for k, _, _ in jobs)))
    if a.dry_run:
        return

    os.makedirs(VOICE_DIR, exist_ok=True)
    model = model_path() if ENGINE != 'elevenlabs' else None
    done = 0
    for key, appkey, mode in jobs:
        lines = lines_of(apps, appkey, mode)
        if not lines:
            print('  %s — no lines found for that app and mode, skipped' % key)
            continue
        print('  %s — %d lines' % (key, len(lines)), flush=True)
        with tempfile.TemporaryDirectory() as work:
            if a.splice and not index.get(key):
                sys.exit('%s has no recording to splice from. Record it whole, without --splice.' % key)
            if a.splice:
                wav, cues, fresh = splice(key, lines, index[key], work)
                print('     spliced: %d kept, %d new' % (len(lines) - fresh, fresh))
            else:
                wav, cues = build(key, lines, model, work)
            m4a = os.path.join(VOICE_DIR, key + '.m4a')
            encode(wav, m4a)
        with open(m4a, 'rb') as f:
            h = hashlib.sha1(f.read()).hexdigest()[:8]
        index[key] = {'file': 'voice/%s.m4a' % key, 'cues': cues, 'h': h}
        print('     %.1f s, %s' % (cues[-1][1], os.path.basename(m4a)))
        done += 1
        # Written after every video, not once at the end: if the voice stops halfway
        # (ElevenLabs out of credits), the videos already re-recorded keep cues that
        # match their new audio instead of the old ones.
        with open(INDEX, 'w', encoding='utf-8') as f:
            json.dump(index, f, ensure_ascii=False)
            f.write('\n')

    with open(INDEX, 'w', encoding='utf-8') as f:
        json.dump(index, f, ensure_ascii=False)
        f.write('\n')
    print('Recorded %d. index.json now has %d.' % (done, len(index)))


if __name__ == '__main__':
    main()
