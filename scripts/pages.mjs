import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
export function changeRollout(previous, action, sha) {
  const current = { estavel: null, anterior: null, canario: null, percentual: 0, ...previous };
  if (action === 'promote') {
    if (!/^[a-f0-9]{40}$/.test(sha)) throw new Error('SHA inválido');
    if (current.estavel === sha) return current;
    return { estavel: sha, anterior: current.estavel, canario: null, percentual: 0 };
  }
  if (action === 'rollback') {
    if (!current.anterior) throw new Error('Sem versão anterior; rollback indisponível na primeira publicação.');
    return { estavel: current.anterior, anterior: current.estavel, canario: null, percentual: 0 };
  }
  throw new Error('Ação inválida');
}
if (process.argv[1] && resolve(process.argv[1]) === resolve('scripts/pages.mjs')) {
  const [action, root = '.publish', build = 'dist', sha] = process.argv.slice(2);
  mkdirSync(root, { recursive: true });
  const pointer = resolve(root, 'rollout.json');
  const previous = existsSync(pointer) ? JSON.parse(readFileSync(pointer, 'utf8')) : {};
  if (action === 'hml' || action === 'release') {
    const version = JSON.parse(readFileSync(resolve(build, 'version.json'), 'utf8'));
    if (!/^[a-f0-9]{40}$/.test(version.commit)) throw new Error('SHA de build inválido');
    const destination = action === 'hml' ? 'hml' : `releases/${version.commit}`;
    const target = resolve(root, destination);
    if (action === 'release' && existsSync(target)) {
      // Release imutável: só permite reutilizar conteúdo idêntico.
      const { readdirSync } = await import('node:fs');
      const walk = (dir, prefix = '') => readdirSync(dir, { withFileTypes: true }).flatMap(item => item.isDirectory() ? walk(resolve(dir,item.name),prefix+item.name+'/') : [prefix+item.name]).sort();
      const files = walk(build);
      if (JSON.stringify(files) !== JSON.stringify(walk(target)) || files.some(file => !readFileSync(resolve(build,file)).equals(readFileSync(resolve(target,file))))) throw new Error('Tentativa de sobrescrever release imutável');
    } else { cpSync(build, target, { recursive: true }); }
  } else {
    const updated = changeRollout(previous, action, sha);
    if (!existsSync(resolve(root,`releases/${updated.estavel}/index.html`))) throw new Error('Release não encontrada');
    writeFileSync(pointer, JSON.stringify(updated, null, 2) + '\n');
  }
  cpSync('pages/index.html', resolve(root, 'index.html'));
  cpSync('pages/status', resolve(root, 'status'), { recursive: true });
  writeFileSync(resolve(root,'.nojekyll'),'');
}
