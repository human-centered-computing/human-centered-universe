from pathlib import Path
import json, sys

ROOT = Path(__file__).resolve().parents[1]
STORIES = ROOT / 'stories'

required = {'id','title','core','status','source_language','culture','belief_context','summary','translations','links'}
valid_cores = {'LIGHT','DARK','COMMON','BRIDGE'}
valid_status = {'core','canon','experimental','fork'}
valid_t = {'canonical','reviewed','community','machine_draft'}
valid_links = {'quantum_echo','echo','contrast','cause','memory','future','character','place','artifact'}

errors = []
all_ids = {}

for mp in STORIES.rglob('meta.json'):
    try:
        d = json.loads(mp.read_text(encoding='utf-8'))
    except Exception as e:
        errors.append(f'{mp}: invalid JSON: {e}')
        continue

    miss = required - d.keys()
    if miss:
        errors.append(f'{mp}: missing {sorted(miss)}')
        continue

    sid = d['id']
    if sid in all_ids:
        errors.append(f'{mp}: duplicate id {sid}')
    all_ids[sid] = (mp, d)

    if d['core'] not in valid_cores:
        errors.append(f'{mp}: invalid core')
    if d['status'] not in valid_status:
        errors.append(f'{mp}: invalid status')
    if d['source_language'] != 'en':
        errors.append(f'{mp}: source_language must be en')

    content_dir = mp.parent / 'content'
    if not (content_dir / 'en.md').exists():
        errors.append(f'{mp}: missing content/en.md')

    if d['translations'].get('en', {}).get('status') != 'canonical':
        errors.append(f'{mp}: en must be canonical')

    for lang, entry in d['translations'].items():
        if entry.get('status') not in valid_t:
            errors.append(f'{mp}: invalid translation status for {lang}')
        if not (content_dir / f'{lang}.md').exists():
            errors.append(f'{mp}: missing content/{lang}.md')

    if content_dir.exists():
        for cf in content_dir.glob('*.md'):
            if cf.stem not in d['translations']:
                errors.append(f'{mp}: undeclared translation {cf.stem}')

    for link in d['links']:
        if link.get('type') not in valid_links:
            errors.append(f'{mp}: invalid link type {link.get("type")}')

    for item in d.get('interactions', []):
        if not item.get('key'):
            errors.append(f'{mp}: interaction missing key')
        if item.get('type') not in {'text','textarea','select'}:
            errors.append(f'{mp}: invalid interaction type {item.get("type")}')
        if item.get('type') == 'select' and not item.get('options'):
            errors.append(f'{mp}: select interaction requires options')

for sid, (mp, d) in all_ids.items():
    for link in d['links']:
        if link.get('target') not in all_ids:
            errors.append(f'{mp}: unknown target {link.get("target")}')

def reachable_core_types(start_sid):
    """Return non-BRIDGE core types reachable through story links.

    Bridge stories are allowed to connect recursively. This avoids forcing every
    bridge node to hang directly from Light/Dark/Common as a star graph.
    """
    seen = set()
    stack = [start_sid]
    cores = set()

    while stack:
        sid = stack.pop()
        if sid in seen or sid not in all_ids:
            continue
        seen.add(sid)
        _, data = all_ids[sid]
        if sid != start_sid and data.get('core') in {'LIGHT','DARK','COMMON'}:
            cores.add(data['core'])
        for link in data.get('links', []):
            target = link.get('target')
            if target and target not in seen:
                stack.append(target)
    return cores

for sid, (mp, d) in all_ids.items():
    if d['core'] == 'BRIDGE':
        cores = reachable_core_types(sid)
        if len(cores) < 2:
            errors.append(f'{mp}: BRIDGE must reach at least two cores through the story graph; reached {sorted(cores)}')

if errors:
    print('VALIDATION FAILED')
    for e in errors:
        print('-', e)
    sys.exit(1)

print(f'OK: {len(all_ids)} story nodes validated.')
