#!/usr/bin/env python3
"""Record the voice for the 'what changed overnight' video: one file per slide.

    python3 kenya/changes/makevoice.py [folder]      # default: this folder; also kenya/lead/video

Reads the spoken lines out of SLIDES in index.html (so the words are in one place)
and writes v01.m4a .. vNN.m4a beside this file, plus voice.json with a fingerprint
of each line. The page plays the recording and only falls back to the phone's own
voice if the recording will not play -- the phone voice is what stayed silent for
Jerry on 10 November.

If you change a spoken line in index.html, run this again. The page compares each
line to its fingerprint and ignores a recording of the old words.

Needs piper and ffmpeg, the same as shop/voicemaker.py, and the same voice file.
"""
import json, os, re, subprocess, sys, tempfile

HERE = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else os.path.dirname(os.path.abspath(__file__))
MODEL = os.path.join(os.environ.get('PIPER_VOICE_DIR', os.path.join(tempfile.gettempdir(), 'daraja-piper')),
                     'en-us-lessac-medium.onnx')


def lines():
    s = open(os.path.join(HERE, 'index.html'), encoding='utf-8').read()
    block = re.search(r'const SLIDES = \[(.*?)\n\];', s, re.S).group(1)
    return [json.loads(m) for m in re.findall(r'^\s*\[("(?:[^"\\]|\\.)*"),\s*\d+\],?\s*$', block, re.M)]


def fingerprint(text):
    """djb2 over UTF-16 code units, 32-bit -- the page computes the same thing."""
    h = 5381
    data = text.encode('utf-16-le')
    for i in range(0, len(data), 2):
        h = ((h * 33) + (data[i] | (data[i + 1] << 8))) & 0xFFFFFFFF
    return str(h)


def for_piper(text):
    t = text.replace('\u2019', "'").replace('\u201c', '"').replace('\u201d', '"').replace('\u2014', ',')
    return re.sub(r'\s+', ' ', t).strip()


def main():
    if not os.path.exists(MODEL):
        sys.exit('voice file missing: %s\nSee shop/voicemaker.py for where it comes from.' % MODEL)
    out = {}
    for i, text in enumerate(lines(), 1):
        name = 'v%02d.m4a' % i
        wav = os.path.join(tempfile.gettempdir(), 'changes-%02d.wav' % i)
        r = subprocess.run(['piper', '-m', MODEL, '-f', wav], input=for_piper(text),
                           capture_output=True, text=True)
        if r.returncode != 0 or not os.path.exists(wav):
            sys.exit('piper failed on line %d:\n%s' % (i, r.stderr.strip()))
        r = subprocess.run(['ffmpeg', '-nostdin', '-y', '-loglevel', 'error', '-i', wav,
                            '-c:a', 'aac', '-b:a', '40k', '-ac', '1', os.path.join(HERE, name)],
                           stdin=subprocess.DEVNULL, capture_output=True, text=True)
        if r.returncode != 0:
            sys.exit('ffmpeg failed on line %d:\n%s' % (i, r.stderr.strip()))
        os.remove(wav)
        out[name] = fingerprint(text)
        print('recorded', name, os.path.getsize(os.path.join(HERE, name)), 'bytes')
    json.dump(out, open(os.path.join(HERE, 'voice.json'), 'w'), indent=1)
    print(len(out), 'lines recorded')


if __name__ == '__main__':
    main()
