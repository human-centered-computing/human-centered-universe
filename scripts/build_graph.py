from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]
STORIES=ROOT/'stories'; OUT=ROOT/'graph'/'universe.mmd'; OUT.parent.mkdir(parents=True,exist_ok=True)
stories={}
for mp in STORIES.rglob('meta.json'):
    d=json.loads(mp.read_text(encoding='utf-8')); stories[d['id']]=d
lines=['graph TD','  LIGHT["☀️ Light Center"]','  DARK["🌑 Dark Center"]','  COMMON["◉ Common Center"]','  LIGHT --- COMMON','  DARK --- COMMON','  LIGHT --- DARK']
for sid,s in sorted(stories.items()):
    n=sid.replace('-','_'); title=s['title'].replace('"',"'")
    lines.append(f'  {n}["{sid} · {title}"]')
    if s['core'] in {'LIGHT','DARK','COMMON'}: lines.append(f'  {n} --> {s["core"]}')
    for link in s['links']: lines.append(f'  {n} -- "{link["type"]}" --> {link["target"].replace("-","_")}')
OUT.write_text('\n'.join(lines)+'\n',encoding='utf-8')
print('Wrote',OUT)
