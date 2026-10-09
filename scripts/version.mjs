import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const pkg = JSON.parse(readFileSync('package.json', 'utf8').replace(/^\uFEFF/, ''));
const commit = process.env.GITHUB_SHA || execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const dirty = !process.env.GITHUB_SHA && Boolean(execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim());
const date = new Date(process.env.SOURCE_DATE_EPOCH ? Number(process.env.SOURCE_DATE_EPOCH) * 1000 : Date.now()).toISOString();
if (process.env.GITHUB_REF_TYPE === 'tag' && process.env.GITHUB_REF_NAME !== `v${pkg.version}`) throw new Error('Tag e package.json divergem.');
writeFileSync('dist/version.json', JSON.stringify({ version: pkg.version, commit, date, dirty }, null, 2) + '\n');
writeFileSync('dist/LEIA-ME.txt', 'Spell & Solve\nOffline: com Node.js instalado, execute node serve.mjs nesta pasta e abra http://127.0.0.1:4173.\nNão exige rede nem npm. Os módulos ES exigem servidor HTTP; abrir index.html por file:// não é suportado.\n');
writeFileSync('dist/serve.mjs', readFileSync('scripts/serve.mjs'));

for (const notice of ['LICENSE', 'THIRD_PARTY.md']) writeFileSync(`dist/${notice}`, readFileSync(notice));
