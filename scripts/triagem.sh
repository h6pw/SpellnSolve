#!/usr/bin/env bash
set -euo pipefail
pasta=${1:-submissao}
: "${PRAZO:?Configure PRAZO com o horário confirmado pelo professor}"
[[ $(date +%s) -le $(date -d "$PRAZO" +%s) ]] || { echo 'Prazo vencido'; exit 1; }
(cd "$pasta" && sha256sum -c MANIFESTO.sha256)
python - "$pasta/SQUAD.md" <<'PY'
import pathlib, sys
rows=[line.split('|')[1:-1] for line in pathlib.Path(sys.argv[1]).read_text().splitlines() if line.startswith('|')]
members=rows[2:]
assert len(members)==4 and all(len(row)==3 and all(v.strip() and 'PENDENTE' not in v for v in row) for row in members), 'Quatro nomes, RAs e papéis reais necessários'
PY
pdfinfo "$pasta/GDD.pdf"
pdftotext "$pasta/GDD.pdf" - | grep -q 'Premissa'
pdftotext "$pasta/GDD.pdf" - | grep -q 'Mecânicas'
pdftotext "$pasta/GDD.pdf" - | grep -q 'Referências'
pdftotext "$pasta/GDD.pdf" - | grep -q 'Gênero'
unzip -t "$pasta/build.zip"
unzip -Z1 "$pasta/build.zip" | grep -qx 'index.html'
duration=$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$pasta/pitch.mp4")
awk -v d="$duration" 'BEGIN {exit !(d>0 && d<=90)}'
url=$(tr -d '\r\n' < "$pasta/LINK_DO_JOGO.txt")
curl --fail --location --max-time 15 "$url" -o /dev/null
BASE_URL="$url" npx playwright test tests/e2e/smoke.spec.js
echo 'TRIAGEM APROVADA'
