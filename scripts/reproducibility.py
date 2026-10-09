"""Executar antes/depois dos dois builds locais; não confundir working tree com commit."""
import hashlib
import json
import pathlib
import sys
root=pathlib.Path('dist')
snapshot={p.relative_to(root).as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(root.rglob('*')) if p.is_file()}
target=pathlib.Path('tmp/reproducibility.json')
if sys.argv[1]=='save':
    target.parent.mkdir(exist_ok=True)
    target.write_text(json.dumps(snapshot,indent=2),encoding='utf-8')
else:
    assert json.loads(target.read_text())==snapshot, 'Builds diferentes'
    print('Todos os arquivos de dist idênticos com SOURCE_DATE_EPOCH fixo')
