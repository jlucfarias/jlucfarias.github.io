import puppeteer from 'puppeteer';
import { resolve } from 'node:path';
import { readdir } from 'node:fs/promises';

async function* getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });

  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);

    if (dirent.isDirectory()) {
      yield* getFiles(res);
      yield res;
    }
  }
}

;(async () => {
  let paths = [
    '/',
  ];

  for await (const f of getFiles('content')) {
    const folder = f.slice(f.indexOf('content') + 7) + '/';
    paths.push(folder);
  }

  paths.map(async path => {
    const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
      ignoreDefaultArgs: ['--disable-extensions'],
      executablePath: process.env.PUPPETEER_EXEC_PATH,
      headless: true,
    });
    const page = await browser.newPage();
    await page.goto(`http://localhost:1111${path}`);
    await page.setViewport({ width: 1366, height: 630 });

    try {
      await page.screenshot({ path: `./content${path}preview.png`, optimizeForSpeed: true });
    } catch (err) {
      console.log(`Error: ${err.message}`);
    } finally {
      await browser.close();
      console.log(`Screenshot has been captured successfully`);
    }
  });
})();
