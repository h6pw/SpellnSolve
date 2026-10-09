import { gerarDesafio } from "../core/challenges.js";

export function criarInimigo(dificuldade, largura, altura) {
  return {
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