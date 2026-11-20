// 쿠팡 상품 페이지(www.coupang.com/vp/products/...)에서 실행: 현재가·정가·할인율을 읽어 돌려줌
// 쿠팡은 로그인 여부·쿠폰에 따라 가격 순서가 바뀌어서, 순서 대신 '글자 크기(가장 큰 값=판매가)'와 '취소선(=정가)'으로 구분해요.
(() => {
  const box = document.querySelector('.price-container');
  if (!box) return { error: 'price-container 없음', title: document.title };
  const leaves = [...box.querySelectorAll('*')]
    .filter(e => e.children.length === 0 && (e.textContent || '').trim());
  const num = s => +s.replace(/[^\d]/g, '');
  const won = leaves.filter(e => /^[\d,]+원$/.test(e.textContent.trim()));
  if (!won.length) return { error: '가격 없음', texts: leaves.map(e => e.textContent.trim()) };
  const size = e => parseFloat(getComputedStyle(e).fontSize) || 0;
  const struck = e => { for (let x = e; x && x !== box.parentElement; x = x.parentElement) {
    if (/line-through/.test(getComputedStyle(x).textDecorationLine)) return true; } return false; };
  const nowEl = won.reduce((a, b) => (size(b) > size(a) ? b : a));
  const now = nowEl.textContent.trim();
  const oldEl = won.find(e => e !== nowEl && struck(e) && num(e.textContent) > num(now));
  const old = oldEl ? oldEl.textContent.trim() : '';
  const pctLeaf = leaves.map(e => e.textContent.trim()).find(s => /^\d+%$/.test(s));
  const pct = old ? (pctLeaf || Math.floor((1 - num(now) / num(old)) * 100) + '%') : '';
  const soldout = /품절|일시품절/.test(document.body.innerText.slice(0, 20000)) && !document.querySelector('.prod-buy-btn, [class*=buy-btn]');
  return { now, old, pct: pct === '0%' ? '' : pct, soldout };
})()
