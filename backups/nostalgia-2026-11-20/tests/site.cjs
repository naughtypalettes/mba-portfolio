const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..');
const server = http.createServer((req,res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  try { const data = fs.readFileSync(file); res.setHeader('Content-Type', ({'.html':'text/html','.css':'text/css','.js':'text/javascript','.png':'image/png','.ttf':'font/ttf'})[path.extname(file)] || 'application/octet-stream'); res.end(data); }
  catch { res.writeHead(404).end(); }
});
(async () => {
 await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
 const url = `http://127.0.0.1:${server.address().port}`;
 const browser = await chromium.launch({headless:true, channel: 'chrome'});
 try {
  const page = await browser.newPage();
  await page.goto(url); await page.evaluate(() => document.fonts.ready);
  await page.locator('img').evaluateAll(async imgs => { imgs.forEach(img => img.loading = 'eager'); await Promise.all(imgs.map(img => img.decode().catch(()=>{}))); });
  await page.keyboard.press('Tab'); assert.equal(await page.locator('.skip-link').evaluate(el => el === document.activeElement), true);
  await page.emulateMedia({reducedMotion:'reduce'}); assert.equal(await page.locator('html').evaluate(el => getComputedStyle(el).scrollBehavior), 'auto');
  assert.equal(await page.locator('h1').count(), 1);
  assert.equal(await page.locator('.case-study').count(), 3);
  assert(await page.locator('button[type=submit]').isDisabled());
  const brokenAnchors = await page.locator('a[href^="#"]').evaluateAll(links => links.filter(a => !document.querySelector(a.getAttribute('href'))).map(a => a.outerHTML));
  assert.deepEqual(brokenAnchors, []);
  fs.mkdirSync(path.join(root, '.preview'), {recursive:true});
  for (const width of [320,390,600,768,820,834,1024,1100,1440]) {
   await page.setViewportSize({width,height:1000});
   assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow at ${width}`);
   if (width <= 1100) {
    const hero = await page.locator('.hero-collage').evaluate(el => {
     const heading = el.querySelector('.hero-copy').getBoundingClientRect();
     const bottom = el.querySelector('.hero-bottom').getBoundingClientRect();
     return {headingBottom:heading.bottom, copyTop:bottom.top, bottom:bottom.bottom, edge:el.getBoundingClientRect().bottom};
    });
    assert(hero.headingBottom <= hero.copyTop && hero.bottom <= hero.edge, `hero copy overlaps at ${width}`);
    assert(await page.locator('nav a').evaluateAll(links => links.every(a => a.getBoundingClientRect().height >= 44)), `small navigation targets at ${width}`);
    assert.equal(await page.locator('.case-grid').first().evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length),1);
   }
   await page.screenshot({path:path.join(root, `.preview/home-${width}.png`),fullPage:true});
   if(width===390) await page.screenshot({path:path.join(root,'.preview/mobile-top.png')});
  }
  await page.setViewportSize({width:1440,height:1050});
  await page.locator('.introduction').screenshot({path:path.join(root, 'assets/made-by-amar-site.png')});
  await page.reload(); await page.locator('img').evaluateAll(imgs => imgs.forEach(img => img.loading = 'eager'));
  assert.deepEqual(await page.locator('img').evaluateAll(async imgs => {await Promise.all(imgs.map(img => img.decode().catch(()=>{}))); return imgs.filter(img => !img.naturalWidth).map(img => img.src);}), []);
  // Configure only the test document; production stays disabled until a real endpoint is supplied.
  await page.route(url + '/', route => route.fulfill({contentType:'text/html',body:fs.readFileSync(path.join(root,'index.html'),'utf8').replace('id="inquiry-form" method="post"','id="inquiry-form" action="https://formspree.io/f/testform" method="post"').replace('type="submit" disabled','type="submit"')}));
  let calls=0, mode='success';
  await page.route('https://formspree.io/f/testform', async route => {
   calls++;
   if(mode === 'network') return route.abort();
   if(mode === 'slow') await new Promise(r => setTimeout(r,300));
   return route.fulfill({status:mode==='reject'?422:mode==='limit'?429:200, contentType:'application/json', body:JSON.stringify({ok:mode!=='reject'})});
  });
  await page.goto(url);
  await page.locator('[data-package="Creative Sprint"]').click();
  assert.equal(await page.locator('[name=project]').inputValue(), 'Creative Sprint');
  const fill = async () => { for (const [name,value] of Object.entries({name:'Test Person',email:'test@example.com',project:'Test project',brief:'A test brief.'})) await page.locator(`[name=${name}]`).fill(value); };
  await fill(); await page.locator('[name=name]').fill('   '); await page.locator('button[type=submit]').click(); assert.equal(calls,0);
  await fill(); await page.locator('[name=email]').fill('invalid'); await page.locator('button[type=submit]').click(); assert.equal(calls,0);
  for (const scenario of ['reject','network','limit','slow']) {
   mode=scenario; await fill();
   await page.locator('button[type=submit]').click();
   if(scenario==='slow') { assert(await page.locator('button[type=submit]').isDisabled()); await page.locator('form').evaluate(f => f.dispatchEvent(new Event('submit',{cancelable:true}))); }
   await page.waitForFunction(() => !document.querySelector('button[type=submit]').disabled);
   if(scenario!=='slow') assert.equal(await page.locator('[name=brief]').inputValue(),'A test brief.');
  }
  assert.equal(calls,4);
  assert.match(await page.locator('#form-status').textContent(), /has been submitted/);
  assert.equal(await page.locator('[name=brief]').inputValue(),'');
  const nojs = await browser.newContext({javaScriptEnabled:false});
  const native = await nojs.newPage();
  await native.route(url+'/', route => route.fulfill({contentType:'text/html',body:fs.readFileSync(path.join(root,'index.html'),'utf8').replace('id="inquiry-form" method="post"','id="inquiry-form" action="https://formspree.io/f/testform" method="post"').replace('type="submit" disabled','type="submit"')}));
  let nativeMethod;
  await native.route('https://formspree.io/f/testform', route => {nativeMethod=route.request().method();return route.fulfill({contentType:'text/html',body:'Accepted'});});
  await native.goto(url); for(const [name,value] of Object.entries({name:'Test',email:'test@example.com',project:'Project',brief:'Brief'})) await native.locator(`[name=${name}]`).fill(value);
  await native.locator('button[type=submit]').click(); await native.waitForURL('https://formspree.io/f/testform'); assert.equal(nativeMethod,'POST');
  console.log('PASS: responsive widths, anchors, images, package prefill, validation, success, rejection, rate limit, network failure, pending duplicate prevention, and native POST. Provider requests were mocked; no inquiry was sent.');
 } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); server.close(); process.exitCode=1; });


