export const WORLD = Object.freeze({ width: 960, height: 540, boundary: 145, maxEnemies: 5 });
export const expression = enemy => {
  const { a, operacao, b } = enemy.desafio;
  return `${a} ${operacao === '*' ? '×' : operacao === '/' ? '÷' : operacao} ${b}`;
};
