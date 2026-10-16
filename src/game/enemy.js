import { gerarDesafio } from "../core/challenges.js";

export function criarInimigo(dificuldade, largura, altura, id = 1) {
  return {
    id, variant: (id - 1) % 3, phase: (id * 2.39996) % (Math.PI * 2), born: 0,
    x: largura - 60,
    y: altura - 110,
    raio: 28,
    velocidade: 60,
    desafio: gerarDesafio(dificuldade),
  };
}

export function atualizarInimigo(inimigo, deltaTime) {
  inimigo.x -= inimigo.velocidade * deltaTime;
}