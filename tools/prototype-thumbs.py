"""Screenshot every prototype option listed on the Playground index (the DEMOS array) at phone size.

Writes next to each page:  prototypes/<slug>/index.html  -> prototypes/<slug>/preview.webp
                           prototypes/<slug>/<name>.html -> prototypes/<slug>/preview-<name>.webp
The index shows these automatically in each option row. Re-run after adding or changing a prototype:

    python3 tools/prototype-thumbs.py              # all options
    python3 tools/prototype-thumbs.py otp          # only hrefs containing "otp"

Needs Playwright with Chromium and Pillow. A per-page wait (ms) can be set in WAIT below; the default
gives intro animations time to settle.
"""
import asyncio, functools, http.server, io, os, sys, threading
from playwright.async_api import async_playwright
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WIDTH = 270                     # stored width (px); shown at ~64 CSS px, so this covers 3x screens
WAIT = {'withdraw-fund-flow': 9000, 'landing-page': 6000, 'order-submit': 1400, 'otp-sheet-morph': 2500, 'credit-limit-coins': 6500}
DEFAULT_WAIT = 2500


def thumb_path(href):
    d, f = os.path.split(href)
    stem = os.path.splitext(f)[0]
    return os.path.join(d, 'preview.webp' if stem == 'index' else 'preview-%s.webp' % stem)


async def main(filt):
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)
    handler.log_message = lambda *a: None
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    base = 'http://127.0.0.1:%d/' % srv.server_port
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx = await b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True)
        pg = await ctx.new_page()
        await pg.goto(base + 'index.html')
        hrefs = await pg.evaluate('DEMOS.flatMap(d => d.variants.map(v => v.href))')
        for href in hrefs:
            if filt and filt not in href:
                continue
            page = await ctx.new_page()
            await page.goto(base + href)
            slug = href.split('/')[1]
            await page.wait_for_timeout(WAIT.get(slug, DEFAULT_WAIT))
            png = await page.screenshot()
            await page.close()
            im = Image.open(io.BytesIO(png)).convert('RGB')
            im = im.resize((WIDTH, round(im.height * WIDTH / im.width)), Image.LANCZOS)
            out = thumb_path(href)
            im.save(os.path.join(ROOT, out), 'WEBP', quality=84, method=6)
            print('%-48s -> %s (%d KB)' % (href, out, os.path.getsize(os.path.join(ROOT, out)) // 1024))
        await b.close()
    srv.shutdown()


if __name__ == '__main__':
    asyncio.run(main(sys.argv[1] if len(sys.argv) > 1 else ''))
