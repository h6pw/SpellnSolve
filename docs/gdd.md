# Spell & Solve - Game Design Document

Versão: {{VERSION}} | Data de geração: {{DATE}}
Estado: refinamento local do bosque encantado em 16/10/2026; esta revisão não foi publicada. Validação humana pendente.

## Premissa
Um gato mago defende o Bosque dos Números de criaturas que se aproximam. O jogador resolve expressões para transformar cálculo mental em feitiços. O jogo oferece prática acessível, gratuita e sem cadastro no navegador. A conexão com educação em tecnologia está no raciocínio lógico e na compreensão de operadores aritméticos usados em programação; não pretende ensinar uma linguagem de programação.

Público-alvo: estudantes iniciantes e pessoas que querem praticar operações básicas. Objetivo educacional: reconhecer operadores, calcular com precisão e ganhar fluência por repetição. Ainda não houve estudo de eficácia ou teste com alunos.

## Gênero e plataforma
Arcade 2D de sobrevivência, fantasia cartoon. Navegadores desktop e mobile com teclado físico ou virtual. JavaScript ES, HTML5 Canvas, HTML/CSS e Vite. Não há login, banco de dados, loja, ranking online ou coleta de dados pessoais. Recorde fica no localStorage; não é enviado à rede.

## Mecânicas-core
Escolher dificuldade > jogar > ler as expressões > digitar um inteiro > Enter ou Lançar > derrotar um inimigo correspondente > acumular pontos > avançar ondas.

Três vidas por partida. Cada inimigo que atinge x=145 tira uma vida. Com zero vidas, Game Over mostra pontuação, onda alcançada e melhor sequência e permite reinício ou retorno ao menu. Não existe vitória final: a meta é superar o próprio recorde. Respostas erradas não tiram vidas, mas o tempo continua correndo. Entradas vazias, texto, hexadecimal e decimais são rejeitadas. Contas repetidas priorizam o inimigo mais próximo.

Cada acerto rende 10 vezes a onda atual. A cada cinco derrotas começa uma nova onda; a velocidade cresce 12% do valor inicial por onda e o intervalo diminui 0,25 s até o piso de 1,5 s. No máximo cinco inimigos simultâneos. Cada onda reforça o mesmo conjunto de operações com menos tempo de decisão. Pausa explícita pelo botão ou Esc congela simulação, efeitos e áudio. Aba oculta pausa automaticamente, preservando eventual pausa manual; delta de animação limitado a 50 ms evita saltos após travamentos.

## Dificuldade e conteúdo
Fácil: soma e subtração com operandos de 1 a 20, velocidade inicial 46 px/s, intervalo 4,6 s.
Médio: soma e subtração até 50; multiplicação de 1 a 20 por 1 a 9; 62 px/s e 3,8 s.
Difícil: soma e subtração até 99; multiplicação de 10 a 99 por 2 a 9; 78 px/s e 3 s. Divisão com divisor de 2 a 9, quociente inteiro de pelo menos 2 e dividendo até 99, construído como divisor vezes quociente: resto sempre zero. Subtração nunca é negativa.

As configurações ficam em src/content/difficulties.json e são validadas por esquema em código antes do uso e pela esteira. Expressões são geradas por src/core/challenges.js com limites específicos por operação. Não há expressões compostas nesta versão.

## Direção visual e referências
Arte original construída por formas em Canvas: gato com chapéu, cajado e capa; criaturas com orelhas e olhos; bosque com pinheiros, lua, cogumelos e vaga-lumes. Feitiço tem preparação do cajado, trajetória curta, impacto e dissolução de até 0,85 s, com pontos reais flutuantes. Criaturas derrotadas saem imediatamente da lista de alvos; até 12 efeitos transitórios são mantidos. Cada criatura recebe ID, variante e fase estáveis ao nascer. Três variantes cosméticas (orelhas, folhas e espírito) compartilham regras. O gato tem repouso, conjuração, dano e derrota. Moldura, grimórios, névoa baixa, arco de pedra e árvores em camadas formam uma clareira misteriosa sem terror. A luz e os símbolos do bosque evoluem discretamente por onda. Paleta azul-petróleo, verde, lilás e dourado. Fontes locais do sistema. Nenhum sprite, imagem ou som externo é carregado pelo jogo.

Referências: o protótipo já presente no repositório e docs/Avaliação.html, material da Faculdade SENAI fornecido pelo aluno. Referência conceitual: prática de aritmética com pressão temporal. Não foram copiados jogos comerciais ou suas artes. Dependências e licenças constam em THIRD_PARTY.md e no SBOM. Arte e código novos foram assistidos por IA; revisão humana ainda pendente em AI-USAGE.md.

## Áudio original
Trilha ambiente de fantasia, instrumental, composta por melodia de sinos e acordes sustentados, sintetizada em tempo real por Web Audio. Sem samples, arquivos externos ou novas bibliotecas. Efeitos distintos para acerto, erro, avanço de onda, perda de vida e Game Over. O áudio começa no clique em Jogar, pausa com aba oculta e a música termina no Game Over/menu. Botões independentes para música e efeitos e volume geral; preferências salvas localmente. Em navegador sem suporte, a partida continua silenciosa.

## Telas e acessibilidade
Menu: título, apresentação do bosque, seleção com explicação das operações e botão Jogar. HUD: pontos, vidas, onda e sequência atual/melhor. Combos em 3, 5 e 10 são visuais, sem multiplicador; inteiro incorreto ou dano quebram a sequência, formato inválido e pausa não. Reinício zera os dados da partida. Campo de resposta com instrução e lista textual das contas em ordem de aproximação, identificadores e urgência; etiquetas DOM com fonte mínima de 16 px, líderes e empacotamento contra colisões substituem texto pequeno no Canvas. Feedback de acerto, formato inválido e inteiro sem correspondência em região aria-live associada ao campo. Acerto limpa; erro preserva e seleciona. Movimento reduzido remove oscilações, reduz partículas e mantém o cálculo legível. Game Over: pontos, Jogar novamente, Voltar ao menu. Controles com foco visível, rótulos e operação por teclado. Layout mobile mantém controles disponíveis sem rolagem horizontal. A lista textual ajuda acesso às contas, mas o jogo temporal ainda exige avaliação de acessibilidade com usuários.

Wireframes textuais: Menu [título | dificuldade | jogar]; Partida [HUD / bosque e inimigos / contas / resposta e Enter]; Fim [Game Over / pontos / reiniciar / menu]. Capturas reais são produzidas pelo roteiro de validação local em reports/.

## Arquitetura
src/core/math.js e challenges.js preservam a lógica matemática. settings.js valida conteúdo e state.js gerencia regras da partida. world.js compartilha dimensões; o estado emite eventos limitados de acerto, dano, onda e derrota; labels.js calcula o posicionamento em pixels CSS. src/game/enemy.js move inimigos; render.js desenha; input.js trata envio; storage.js persiste recorde; audio.js sintetiza a trilha e efeitos com Web Audio. main.js conecta DOM e requestAnimationFrame. Renderização não define pontuação nem valida respostas.

## Esteira
Repositório: https://github.com/h6pw/SpellnSolve
Fluxo: commit/PR > npm ci > lint e conteúdo > Vitest/JUnit/cobertura > auditoria/Gitleaks/SBOM > build/version.json > GDD.pdf > ZIP/SHA-256 > E2E local > homologação > E2E remoto > aprovação humana de produção > pasta imutável verde > smoke > promoção > smoke público > rollback em falha > release SemVer.

Deploy, release, monitoramento e submissão vêm desabilitados pelas variáveis ENABLE_*. O mesmo ZIP é promovido sem recompilar. A branch gh-pages guarda snapshots, e o workflow publica no Pages explicitamente. Branch observabilidade recebe sondas e DORA; /status/ consulta os dados. A configuração e o ensaio de rollback dependem de autorização e execução no GitHub.

## Critérios de aceitação
Menu, três dificuldades, inimigos em movimento, respostas inteiras, feitiços, pontos, três vidas, derrota, reinício, recorde, progressão e mobile devem ser exercitados por unidade, integração e E2E. Preservar os dez testes originais. Cobertura mínima de src/core/: 70%. Build abaixo de 25 MB. Sem ativos externos sem licença.

Evidências e pendências dos dez integráveis ficam em docs/evidencias.md. PDF não comprova aprovação do squad, eficácia pedagógica, publicação, prazos ou triagem. Não declarar entrega completa sem URL, vídeo, quatro membros e execução real da esteira.

## Validação do refinamento local

Regras, foco, pausas, identidade, combo e etiquetas têm regressões automatizadas. Capturas de menu, jogo, combo, pausa, derrota e mobile, vídeo e medição local de frames ficam em reports/refinement/. Ver docs/refinamento.md para resultados, limitações e reversão. Sem testes em aparelho móvel físico; zoom foi avaliado por viewport CSS equivalente a 200%, não por inspeção manual do zoom de navegador. Sem alterações de dependências, curva de dificuldade, localStorage de recordes, workflows ou configurações externas.
