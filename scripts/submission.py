"""Falha se faltam itens reais; não cria vídeo, URL ou membros fictícios."""
import hashlib
import os
import pathlib
import shutil
source=pathlib.Path('artifacts')
target=pathlib.Path('submissao')
url=os.environ.get('SITE_URL','')
pitch=pathlib.Path(os.environ.get('PITCH_FILE','pitch.mp4'))
assert url.startswith('https://'), 'SITE_URL pública necessária'
assert pitch.is_file(), 'pitch.mp4 real necessário'
target.mkdir(exist_ok=True)
for name in ['build.zip','GDD.pdf','build.zip.sha256']:
    shutil.copy2(source/name,target/name)
shutil.copy2(pitch,target/'pitch.mp4')
shutil.copy2('SQUAD.md',target/'SQUAD.md')
(target/'LINK_DO_JOGO.txt').write_text(url+'\n',encoding='utf-8')
(target/'MANIFESTO.sha256').write_text(''.join(hashlib.sha256(p.read_bytes()).hexdigest()+'  '+p.name+'\n' for p in sorted(target.iterdir()) if p.name!='MANIFESTO.sha256'),encoding='utf-8')
print('Pacote preparado; executar triagem.sh antes de submetê-lo')
