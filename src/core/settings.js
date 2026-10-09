import difficulties from '../content/difficulties.json' with { type: 'json' };
export function validateSettings(content) {
  for (const key of ['facil', 'medio', 'dificil']) {
    const item = content?.[key];
    if (!item || typeof item.label !== 'string' || typeof item.description !== 'string'
      || !Number.isFinite(item.speed) || item.speed <= 0
      || !Number.isFinite(item.spawnInterval) || item.spawnInterval <= 0
      || !Number.isInteger(item.maxOperand) || item.maxOperand < 2
      || !Array.isArray(item.operations) || !item.operations.length
      || item.operations.some(operation => !['+', '-', '*', '/'].includes(operation))) {
      throw new Error(`Configuração inválida: ${key}`);
    }
    if (item.operations.includes('*')) {
      const multiplication = item.multiplication;
      if (!multiplication || !['minA', 'maxA', 'minB', 'maxB'].every(field => Number.isInteger(multiplication[field]))
        || multiplication.minA < 1 || multiplication.maxA < multiplication.minA || multiplication.maxA > item.maxOperand
        || multiplication.minB < 1 || multiplication.maxB < multiplication.minB || multiplication.maxB > 9) {
        throw new Error(`Multiplicação inválida: ${key}`);
      }
    }
  }
  return content;
}
export const settings = validateSettings(difficulties);
