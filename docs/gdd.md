# Spell & Solve — Game Design Document

**Versão:** 0.1.0
**Status:** Em planejamento

## 1. Visão geral

Spell & Solve é um jogo educativo de cálculo mental para navegador. O jogador controla a defesa de um gato mágico contra inimigos que se aproximam enquanto apresentam desafios matemáticos.

O objetivo é responder corretamente às operações antes que os inimigos alcancem o personagem, acumulando pontos e sobrevivendo pelo maior tempo possível.

## 2. Objetivo educacional

Estimular a prática de cálculo mental, o raciocínio lógico, a agilidade de resolução de problemas e a atenção por meio de uma experiência interativa.

## 3. Público-alvo

Estudantes e pessoas interessadas em praticar operações matemáticas básicas de maneira lúdica.

## 4. Plataforma e tecnologias

* Plataforma: navegadores modernos para computador.
* Linguagens: HTML, CSS e JavaScript.
* Renderização do jogo: HTML5 Canvas.
* Ambiente de desenvolvimento e build: Vite.
* Testes: Vitest e Playwright.
* Versionamento e automação: Git, GitHub e GitHub Actions.

## 5. Mecânica principal

1. O jogador seleciona uma dificuldade no menu inicial.
2. Um inimigo aparece com uma operação matemática.
3. O jogador digita a resposta e pressiona Enter.
4. Uma resposta correta derrota o inimigo e aumenta a pontuação.
5. Se um inimigo alcançar o gato, o jogador perde uma vida.
6. A partida termina quando as três vidas são perdidas.

## 6. Operações matemáticas

O jogo trabalhará com adição, subtração, multiplicação e divisão. As divisões deverão produzir resultados inteiros. As expressões com múltiplas operações respeitarão a ordem convencional das operações matemáticas.

## 7. Dificuldade e progressão

O menu oferecerá três dificuldades: Fácil, Médio e Difícil. Cada uma terá uma configuração inicial própria, com aumento gradual do desafio durante a partida.

Os parâmetros exatos de cada dificuldade serão definidos antes da implementação.

## 8. Pontuação e derrota

O jogador acumulará pontos ao resolver corretamente os desafios. A partida termina após perder três vidas. Ao final, serão apresentados a pontuação obtida e os controles para reiniciar.

O sistema de recorde local será considerado para a primeira versão jogável.

## 9. Direção visual

A identidade visual será cartoon 2D, com um gato mágico como personagem principal e inimigos estilizados. A interface deverá manter boa legibilidade das operações e do campo de resposta.

## 10. Escopo do MVP

A primeira versão incluirá menu, seleção de dificuldade, desafios matemáticos, inimigos em movimento, campo de resposta, pontuação, três vidas e tela de fim de jogo.

Recursos como contas de usuário, ranking online, loja e desbloqueios ficam fora do escopo inicial.

## 11. Critérios de aceitação

* O jogo inicia no navegador.
* É possível selecionar uma dificuldade e iniciar uma partida.
* O jogador pode enviar respostas usando Enter.
* Respostas corretas e incorretas são tratadas adequadamente.
* Os inimigos avançam e podem alcançar o personagem.
* Perder três vidas encerra a partida.
* A pontuação é exibida corretamente.
* O projeto pode ser testado e compilado por comandos documentados.
