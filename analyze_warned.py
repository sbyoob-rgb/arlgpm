import json

with open('backup/fac_records.json', encoding='utf-8') as f:
    records = json.load(f)

summary = {}
for r in records:
    p = r['plate']
    if p not in summary:
        summary[p] = {'plate': p, 'count': 0, 'lastDate': '', 'notes': []}
    summary[p]['count'] += 1
    summary[p]['lastDate'] = r['date']
    if r.get('note'):
        summary[p]['notes'].append(r['note'])

warned = [v for v in summary.values() if v['count'] >= 3]
warned.sort(key=lambda x: x['count'], reverse=True)
print(f'Total warned vehicles: {len(warned)}')
for idx, w in enumerate(warned, 1):
    print(f"{idx}. {w['plate']} ({w['count']}회) - Last: {w['lastDate']} - Phone: {set(w['notes'])}")
