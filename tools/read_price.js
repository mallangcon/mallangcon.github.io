// 쿠팡 상품 페이지(www.coupang.com/vp/products/...)에서 실행: 현재가·정가·할인율을 읽어 돌려줌
(() => {
  const box = document.querySelector('.price-container');
  if (!box) return { error: 'price-container 없음', title: document.title };
  const t = [...box.querySelectorAll('*')]
    .filter(e => e.children.length === 0 && (e.textContent || '').trim())
    .map(e => e.textContent.trim());
  const won = t.filter(s => /^[\d,]+원$/.test(s));
  const num = s => +s.replace(/[^\d]/g, '');
  if (!won.length) return { error: '가격 없음', texts: t };
  const now = won[0];
  const bigger = won.filter(s => num(s) > num(now)).sort((a, b) => num(b) - num(a));
  const old = bigger[0] || '';
  const pct = old ? (t.find(s => /^\d+%$/.test(s)) || Math.floor((1 - num(now) / num(old)) * 100) + '%') : '';
  const soldout = /품절|일시품절/.test(document.body.innerText.slice(0, 20000)) && !document.querySelector('.prod-buy-btn, [class*=buy-btn]');
  return { now, old, pct: pct === '0%' ? '' : pct, soldout };
})()
