#!/usr/bin/env bash
set -euo pipefail
# Só executa remotamente após o gate configurado no workflow.
[[ "${GITHUB_ACTIONS:-}" == true ]] || { echo 'Publicação permitida apenas no Actions'; exit 1; }
acao=${1:?acao}; build=${2:-dist}; sha=${3:-}
git config user.name 'github-actions[bot]'
git config user.email '41898282+github-actions[bot]@users.noreply.github.com'
if [[ ! -d .publish ]]; then
  if git fetch origin gh-pages; then
    git worktree add --detach .publish FETCH_HEAD
  else
    git worktree add --detach .publish HEAD
    git -C .publish switch --orphan gh-pages
  fi
fi
node scripts/pages.mjs "$acao" .publish "$build" "$sha"
if [[ "$acao" == release ]]; then
  : "${BUILD_ARCHIVE:?Caminho do ZIP aprovado necessário}"
  release_sha=$(node --input-type=module -e 'import fs from "node:fs"; console.log(JSON.parse(fs.readFileSync(process.argv[1])).commit)' "$build/version.json")
  [[ "$release_sha" =~ ^[a-f0-9]{40}$ ]]
  mkdir -p ".publish/packages/$release_sha"
  if [[ -f ".publish/packages/$release_sha/build.zip" ]]; then
    cmp "$BUILD_ARCHIVE" ".publish/packages/$release_sha/build.zip"
  else
    cp "$BUILD_ARCHIVE" ".publish/packages/$release_sha/build.zip"
  fi
fi
git -C .publish add .
if ! git -C .publish diff --cached --quiet; then
  git -C .publish commit -m "deploy: $acao ${GITHUB_SHA:-} por ${GITHUB_ACTOR:-} run ${GITHUB_RUN_ID:-}"
  git -C .publish push origin HEAD:gh-pages
fi
