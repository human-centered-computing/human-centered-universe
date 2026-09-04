from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
STORIES = ROOT / 'stories'
OUT = ROOT / 'graph' / 'universe.mmd'
OUT.parent.mkdir(parents=True, exist_ok=True)

stories = {}
for mp in STORIES.rglob('meta.json'):
    d = json.loads(mp.read_text(encoding='utf-8'))
    if d.get('status') not in {'canon','core'}:
        continue
    stories[d['id']] = d

ordered = sorted(stories.items(), key=lambda kv: (kv[1].get('book_order', 9999), kv[0]))

lines = [
    'graph TD',
    '  LIGHT["☀️ Light Center"]',
    '  DARK["🌑 Dark Center"]',
    '  COMMON["◉ Common Center"]',
    '  LIGHT --- COMMON',
    '  DARK --- COMMON',
    '  LIGHT --- DARK'
]

for sid, s in ordered:
    n = sid.replace('-', '_')
    title = s['title'].replace('"', "'")
    lines.append(f'  {n}["{sid} · {title}"]')
    if s['core'] in {'LIGHT','DARK','COMMON'}:
        lines.append(f'  {n} --> {s["core"]}')

for sid, s in ordered:
    n = sid.replace('-', '_')
    for link in s.get('links', []):
        target = link['target'].replace('-', '_')
        lines.append(f'  {n} -- "{link["type"]}" --> {target}')

OUT.write_text('\n'.join(lines) + '\n', encoding='utf-8')
print('Wrote', OUT)
