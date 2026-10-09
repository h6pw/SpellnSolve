"""ZIP determinístico; reutilizar o mesmo artefato em todos os ambientes."""
import hashlib
import pathlib
import zipfile
root = pathlib.Path('dist')
assert (root / 'index.html').is_file(), 'Execute npm run build'
out = pathlib.Path('artifacts')
out.mkdir(exist_ok=True)
with zipfile.ZipFile(out / 'build.zip', 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
    for path in sorted(root.rglob('*')):
        if path.is_file():
            info = zipfile.ZipInfo(path.relative_to(root).as_posix(), (2026, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            archive.writestr(info, path.read_bytes())
data = (out / 'build.zip').read_bytes()
assert len(data) < 25 * 1024 * 1024, 'Pacote excede 25 MB'
(out / 'build.zip.sha256').write_text(hashlib.sha256(data).hexdigest() + '  build.zip\n', encoding='utf-8')
print(f'build.zip: {len(data)} bytes; SHA-256 {hashlib.sha256(data).hexdigest()}')
