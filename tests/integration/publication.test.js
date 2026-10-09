import { it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
it('publicação local mantém release imutável e rejeita reconstrução divergente', () => {
  const temp=mkdtempSync(join(tmpdir(),'spell-publication-'));
  const build=join(temp,'build'), root=join(temp,'site');mkdirSync(build);
  const sha='c'.repeat(40);
  writeFileSync(join(build,'version.json'),JSON.stringify({commit:sha,version:'0.1.0'}));
  writeFileSync(join(build,'index.html'),'<h1>Build verificado</h1>');
  const run=action=>execFileSync(process.execPath,['scripts/pages.mjs',action,root,build,sha],{encoding:'utf8',stdio:'pipe'});
  run('release');run('release');run('promote');
  expect(JSON.parse(readFileSync(join(root,'rollout.json'),'utf8')).estavel).toBe(sha);
  writeFileSync(join(build,'index.html'),'build divergente');
  expect(()=>run('release')).toThrow();
  expect(readFileSync(join(root,'releases',sha,'index.html'),'utf8')).toContain('verificado');
});
