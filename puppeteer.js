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
  const rootPath = resolve('.');
  let paths = [
    '/',
  ];
  const ignoredFolders = [
    'images',
    'processed_images',
    'styles',
  ];

  for await (const f of getFiles('public')) {
    const folder = f.slice(f.indexOf('public') + 7);

    if (
      ignoredFolders.includes(folder)
      || ignoredFolders.filter(_folder => folder.includes(_folder)).length > 0
    ) {
      continue;
    }

    paths.push('/' + folder + '/');
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
    await page.goto(`file://${rootPath}/public${path}index.html`, {
      waitUntil: 'networkidle0',
    });
    await page.setViewport({ width: 1366, height: 630 });

    try {
      await page.screenshot({ path: `./content${path}preview.png`, optimizeForSpeed: true });
      console.log(`Screenshot of ${path} has been captured successfully`);
    } catch (err) {
      console.error(`Error: ${err.message}`);
    } finally {
      await browser.close();
    }
  });
})();
