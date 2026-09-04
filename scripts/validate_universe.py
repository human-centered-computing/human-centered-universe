from pathlib import Path
import json, sys
ROOT = Path(__file__).resolve().parents[1]
STORIES = ROOT / 'stories'
required={'id','title','core','status','source_language','culture','belief_context','summary','translations','links'}
valid_cores={'LIGHT','DARK','COMMON','BRIDGE'}
valid_status={'core','canon','experimental','fork'}
valid_t={'canonical','reviewed','community','machine_draft'}
valid_links={'quantum_echo','echo','contrast','cause','memory','future','character','place','artifact'}
errors=[]; all_ids={}
for mp in STORIES.rglob('meta.json'):
    try: d=json.loads(mp.read_text(encoding='utf-8'))
    except Exception as e: errors.append(f'{mp}: invalid JSON: {e}'); continue
    miss=required-d.keys()
    if miss: errors.append(f'{mp}: missing {sorted(miss)}'); continue
    sid=d['id'];
    if sid in all_ids: errors.append(f'{mp}: duplicate id {sid}')
    all_ids[sid]=(mp,d)
    if d['core'] not in valid_cores: errors.append(f'{mp}: invalid core')
    if d['status'] not in valid_status: errors.append(f'{mp}: invalid status')
    if d['source_language']!='en': errors.append(f'{mp}: source_language must be en')
    if not (mp.parent/'content'/'en.md').exists(): errors.append(f'{mp}: missing content/en.md')
    if d['translations'].get('en',{}).get('status')!='canonical': errors.append(f'{mp}: en must be canonical')
    for lang,entry in d['translations'].items():
        if entry.get('status') not in valid_t: errors.append(f'{mp}: invalid translation status for {lang}')
        if not (mp.parent/'content'/f'{lang}.md').exists(): errors.append(f'{mp}: missing content/{lang}.md')
    for cf in (mp.parent/'content').glob('*.md'):
        if cf.stem not in d['translations']: errors.append(f'{mp}: undeclared translation {cf.stem}')
    for link in d['links']:
        if link.get('type') not in valid_links: errors.append(f'{mp}: invalid link type {link.get("type")}')
for sid,(mp,d) in all_ids.items():
    for link in d['links']:
        if link.get('target') not in all_ids: errors.append(f'{mp}: unknown target {link.get("target")}')
    if d['core']=='BRIDGE':
        cores={all_ids[x['target']][1]['core'] for x in d['links'] if x.get('target') in all_ids}
        if len(cores-{'BRIDGE'})<2: errors.append(f'{mp}: BRIDGE must connect at least two cores')
if errors:
    print('VALIDATION FAILED')
    [print('-',e) for e in errors]
    sys.exit(1)
print(f'OK: {len(all_ids)} story nodes validated.')
