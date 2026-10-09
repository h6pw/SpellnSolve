import { calcularResposta } from "./math.js";
import { settings } from "./settings.js";

function numeroAleatorio(minimo, maximo) {
  return Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
}

export function gerarDesafio(dificuldade) {
  const configuracao = settings[dificuldade];

  if (!configuracao) {
    throw new Error("Dificuldade inválida.");
  }

  // Escolhe uma operação permitida para a dificuldade.
  const operacao =
    configuracao.operations[
      numeroAleatorio(0, configuracao.operations.length - 1)
    ];

  // Gera dois números dentro do limite da dificuldade.
  let a = numeroAleatorio(1, configuracao.maxOperand);
  let b = numeroAleatorio(1, configuracao.maxOperand);

  if (operacao === "*") {
    const { minA, maxA, minB, maxB } = configuracao.multiplication;
    a = numeroAleatorio(minA, maxA);
    b = numeroAleatorio(minB, maxB);
  }

  // Evita resultados negativos nas subtrações.
  if (operacao === "-") {
    if (a < b) {
      [a, b] = [b, a];
    }
  }

  // Construir o dividendo a partir do divisor e quociente garante resto zero.
  // Evita ÷1 e resultados 1, sem criar dividendos acima do limite do modo.
  if (operacao === "/") {
    b = numeroAleatorio(2, 9);
    a = b * numeroAleatorio(2, Math.floor(configuracao.maxOperand / b));
  }

  return {
    a,
    operacao,
    b,
    resposta: calcularResposta(a, operacao, b),
  };
}
