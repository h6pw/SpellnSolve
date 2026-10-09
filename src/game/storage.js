const KEY = 'spell-solve-record';
export function readRecord(storage) {
  try { const value = Number(storage.getItem(KEY)); return Number.isSafeInteger(value) && value >= 0 ? value : 0; }
  catch { return 0; }
}
export function saveRecord(storage, score) {
  const record = Math.max(readRecord(storage), score);
  try { storage.setItem(KEY, String(record)); } catch { /* Modo privado: a partida continua. */ }
  return record;
}
