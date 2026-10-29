// Kiểm tra giao diện trên trình duyệt thật (tùy chọn, cần: npm i -D playwright && npx playwright install chromium)
// Chạy: node tests/browser/layout-qa.cjs [cỡ màn hình] [dark,light]
// Dò chữ đè nhau, chữ tràn khỏi ô cung, trang bị cuộn ngang và bấm thử mọi nút (i).
const { chromium } = require('playwright');
const OUT = require('path').join(__dirname, 'shots') + '/'; require('fs').mkdirSync(OUT, { recursive: true });
const URL0 = 'file://' + require('path').resolve(__dirname, '../../index.html');
const charts = ['la-so-1998-8-29-1630-nam-dl-tz7-x2026', 'la-so-1984-3-10-0800-nu-dl-tz7-x2026', 'la-so-2001-12-1-2330-nam-dl-tz7-x2026', 'la-so-1975-6-15-1200-nu-al-tz8-x2026'];
const sizes = (process.argv[2] || '1440,1180,1024,390').split(',').map(Number);
const schemes = (process.argv[3] || 'dark,light').split(',');
const shots = process.argv[4] === 'shots';
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
  let total = 0;
  for (const scheme of schemes) for (const w of sizes) for (const h of charts) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, colorScheme: scheme });
    const page = await ctx.newPage();
    const errs = []; page.on('pageerror', (e) => errs.push(e.message));
    await page.goto(URL0 + '#' + h); await page.waitForTimeout(400);
    const res = await page.evaluate(() => {
      const out = { overlaps: [], overflow: [], pageOverflow: document.documentElement.scrollWidth > window.innerWidth + 1 };
      const vis = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' ? r : null; };
      const sel = '.star, .c-cc, .c-name, .c-dh b, .c-dh small, .c-foot span, .mark, .tt, .ring, .vcd, .c-luu span, .plaque .phan, .plaque h2, .plaque .sub, .tb dt, .tb dd, .c-compact span';
      const els = Array.from(document.querySelectorAll('#chart ' + sel)).filter((e) => !e.closest('.c-foot') || e.parentElement.classList.contains('c-foot')).filter(vis);
      // text bounds via Range for accuracy
      const box = (el) => { const r = document.createRange(); r.selectNodeContents(el); const b = r.getBoundingClientRect(); return b.width ? b : el.getBoundingClientRect(); };
      const items = els.map((el) => ({ el, b: box(el), label: (el.className || el.tagName) + ':' + el.textContent.trim().slice(0, 24) }));
      for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) {
        const A = items[i], B = items[j];
        if (A.el.contains(B.el) || B.el.contains(A.el)) continue;
        const x = Math.min(A.b.right, B.b.right) - Math.max(A.b.left, B.b.left), y = Math.min(A.b.bottom, B.b.bottom) - Math.max(A.b.top, B.b.top);
        if (x > 1.5 && y > 1.5) out.overlaps.push(A.label + '  <>  ' + B.label);
      }
      document.querySelectorAll('#chart .cell').forEach((c) => {
        const cr = c.getBoundingClientRect();
        c.querySelectorAll(sel).forEach((el) => { if (!vis(el)) return; const b = box(el); if (b.left < cr.left - 1 || b.right > cr.right + 1 || b.top < cr.top - 1 || b.bottom > cr.bottom + 1) out.overflow.push(c.getAttribute('data-chi') + ':' + el.textContent.trim().slice(0, 20)); });
        // text clipped by ellipsis
        c.querySelectorAll('.c-minor .star').forEach((el) => { if (el.scrollWidth > el.clientWidth + 1) out.overflow.push(c.getAttribute('data-chi') + ' cut:' + el.textContent.trim()); });
      });
      return out;
    });
    // click every (i)
    const infos = await page.$$('.info:visible');
    let infoFail = [];
    for (const b of infos) {
      await b.scrollIntoViewIfNeeded();
      try { await b.click({ timeout: 2500 }); } catch (e) { const m = /<([^>]+)>[^<]*<\/[a-z]+> from <([^>]+)>/.exec(e.message); infoFail.push((await b.getAttribute('data-info')) + ': click blocked by ' + (m ? m[1].slice(0, 60) + ' / ' + m[2].slice(0, 40) : e.message.slice(0, 80))); continue; }
      const ok = await page.evaluate(() => { const p = document.getElementById('pop'); if (p.hidden) return 'hidden'; const r = p.getBoundingClientRect(); return (r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight) ? 'ok' : 'offscreen ' + JSON.stringify([r.left, r.top, r.right, r.bottom]); });
      if (ok !== 'ok') infoFail.push((await b.getAttribute('data-info')) + ':' + ok);
      await page.keyboard.press('Escape');
    }
    const n = res.overlaps.length + res.overflow.length + infoFail.length + (res.pageOverflow ? 1 : 0) + errs.length;
    total += n;
    console.log(`[${scheme} ${w} ${h.slice(6, 16)}] overlaps=${res.overlaps.length} overflow=${res.overflow.length} infoFail=${infoFail.length}/${infos.length} pageOverflow=${res.pageOverflow} errors=${errs.length}`);
    res.overlaps.slice(0, 8).forEach((x) => console.log('   OV ' + x));
    res.overflow.slice(0, 6).forEach((x) => console.log('   OF ' + x));
    infoFail.slice(0, 5).forEach((x) => console.log('   IF ' + x));
    errs.slice(0, 3).forEach((x) => console.log('   ERR ' + x));
    if (shots && h === charts[0]) await page.screenshot({ path: OUT + `qa-${scheme}-${w}.png`, fullPage: false, clip: undefined });
    await ctx.close();
  }
  console.log('TOTAL ISSUES', total);
  await browser.close();
})();
