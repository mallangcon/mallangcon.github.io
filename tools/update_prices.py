"""사용법: python3 tools/update_prices.py prices.json
prices.json 예: {"1": {"now": "34,000원", "old": "35,000원", "pct": "3%"}, "2": {"src": "https://www.coupang.com/vp/products/..."}}
번호(n)가 같은 상품의 now/old/pct/src 를 바꾸고, 안내 문구의 '가격은 … 기준' 시각을 지금(한국시간)으로 바꿈."""
import json, re, sys, datetime
p = 'index.html'
s = open(p, encoding='utf-8').read()
m = re.search(r'const items=(\[.*?\]);\n', s, re.S)
items = json.loads(m.group(1))
upd = json.load(open(sys.argv[1], encoding='utf-8'))
changed = []
for it in items:
    u = upd.get(str(it['n']))
    if not u:
        continue
    for k in ('now', 'old', 'pct', 'src'):
        if k in u and it.get(k) != u[k]:
            changed.append(f"{it['n']}번 {k}: {it.get(k)} → {u[k]}")
            it[k] = u[k]
s = s[:m.start(1)] + json.dumps(items, ensure_ascii=False) + s[m.end(1):]
kst = datetime.datetime.now(datetime.timezone.utc).replace(tzinfo=None) + datetime.timedelta(hours=9)
s = re.sub(r'가격은 [^<]*? 기준이며', f'가격은 {kst:%Y.%m.%d} {kst.hour}시 기준이며', s)
open(p, 'w', encoding='utf-8').write(s)
print('\n'.join(changed) or '가격 변동 없음')
