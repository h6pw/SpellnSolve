import { calcularResposta } from "./math.js";

const CONFIGURACOES = {
  facil: {
    maximo: 10,
    operacoes: ["+", "-"],
  },

  medio: {
    maximo: 20,
    operacoes: ["+", "-", "*"],
  },

  dificil: {
    maximo: 50,
    operacoes: ["+", "-", "*", "/"],
  },
};

function numeroAleatorio(minimo, maximo) {
  return Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
}

export function gerarDesafio(dificuldade) {
  const configuracao = CONFIGURACOES[dificuldade];

  if (!configuracao) {
    throw new Error("Dificuldade inválida.");
  }

  // Escolhe uma operação permitida para a dificuldade.
  const operacao =
    configuracao.operacoes[
      numeroAleatorio(0, configuracao.operacoes.length - 1)
    ];

  // Gera dois números dentro do limite da dificuldade.
  let a = numeroAleatorio(1, configuracao.maximo);
  let b = numeroAleatorio(1, configuracao.maximo);

  // Evita resultados negativos nas subtrações.
  if (operacao === "-") {
    if (a < b) {
      [a, b] = [b, a];
    }
  }

  // Garante divisões inteiras e dentro do limite.
  if (operacao === "/") {
    a = numeroAleatorio(1, configuracao.maximo);

    const divisores = [];

    for (let i = 1; i <= a; i++) {
      if (a % i === 0) {
        divisores.push(i);
      }
    }

    b = divisores[
      numeroAleatorio(0, divisores.length - 1)
    ];
  }

  return {
    a,
    operacao,
    b,
    resposta: calcularResposta(a, operacao, b),
  };
}
