export const repository = process.env.GITHUB_REPOSITORY;
export async function api(path, options = {}) {
  if (!repository || !process.env.GITHUB_TOKEN) throw new Error('GITHUB_REPOSITORY e GITHUB_TOKEN necessários');
  const response = await fetch(`https://api.github.com/repos/${repository}/${path}`, {
    ...options, headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, 'X-GitHub-Api-Version': '2022-11-28', ...options.headers }, signal: AbortSignal.timeout(15000)
  });
  if (!response.ok) throw new Error(`GitHub API ${response.status}: ${path}`);
  return response.status === 204 ? null : response.json();
}
export async function paginate(path, key) {
  const all = [];
  for(let page=1; ;page++) {
    const result = await api(`${path}${path.includes('?')?'&':'?'}per_page=100&page=${page}`);
    const list = key ? result[key] : result;
    all.push(...list);
    if (list.length < 100) return all;
  }
}
