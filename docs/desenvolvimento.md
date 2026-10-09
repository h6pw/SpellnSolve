# Guia de desenvolvimento e DevOps

Jogo arcade educativo em JavaScript ES e Canvas: um gato mago defende o bosque resolvendo contas. Primeira versão jogável, sem cadastro ou serviços de dados. O recorde fica no navegador.

## Rodar e verificar

Requisitos: Node 24.13.1 (linha 24), npm 11. PDF: Python 3.12 e `python -m pip install -r requirements-dev.txt`. Windows: instalar Python e adicioná-lo ao PATH. E2E: `npx playwright install chromium` (Linux CI: `--with-deps`).

```sh
npm ci
npm run dev
npm run lint
npm run content:validate
npm run test:ci
npm run build
npm run test:e2e
npm run gdd:pdf
npm run package
```

`npm run test` mantém o modo watch. `npm run validate` executa lint, testes com cobertura, build e E2E. JUnit e cobertura em reports/; E2E gera relatório HTML em playwright-report/. Artefatos em artifacts/: GDD.pdf, build.zip, build.zip.sha256. São saídas geradas, não versionadas.

Descompacte build.zip e execute `node serve.mjs` dentro da pasta; abra http://127.0.0.1:4173. Roda sem acesso à rede e sem npm. Abrir index.html por file:// não funciona devido aos módulos ES. O servidor incluído serve apenas em loopback.

## Jogar

Escolha Fácil (soma/subtração), Médio (+ multiplicação) ou Difícil (+ divisão inteira). Digite um resultado e pressione Enter ou Lançar. Um acerto elimina uma criatura e vale 10 pontos vezes a onda. Quando duas contas têm a mesma resposta, o inimigo mais próximo é atingido. Cada cinco acertos aumentam a onda, velocidade e frequência. Três inimigos chegando ao gato encerram a partida. Respostas erradas não removem vidas. Há reinício e recorde persistente. A partida pausa quando a aba fica oculta.

## Arquitetura

- src/core/: aritmética, gerador existente, validação de conteúdo e regras/estado.
- src/content/: configurações JSON validadas.
- src/game/: movimento, renderização original, formulário e armazenamento.
- src/main.js: conexão com DOM e ciclo requestAnimationFrame.
- tests/: unidade, integração de conteúdo/CLI/rollout, regressão E2E e smoke.
- scripts/: versão, PDF, ZIP, publicação, sondas, DORA e triagem.
- pages/: carregador de releases e painel de status.

O GDD está em docs/gdd.md e as evidências em docs/evidencias.md. O arquivo docs/Avaliação.html foi lido como critério; não faz parte da build. Recursos antigos do template foram preservados, mas publicDir:false evita sua distribuição, pois a origem de alguns não foi confirmada. Nenhuma imagem externa é usada pelo jogo.

## Git e versionamento

Trabalho local nesta solicitação autorizado diretamente em main, preservando alterações anteriores. Não foram criados commits, PRs, tags ou pushes pela IA. Fluxo de equipe proposto: branches feature/* curtas > PR revisado por outra pessoa > CI verde > main. Conventional Commits. Tags anotadas vX.Y.Z somente após revisão; package.json, notas e tag precisam coincidir. Ainda falta demonstrar os dez PRs e contribuições exigidos pela avaliação.

## CI/CD e autorização

esteira.yml roda em push main, tags v* e PR. CI executa instalação pelo lockfile, lint, conteúdo, JUnit/cobertura, auditoria de produção (bloqueia vulnerabilidade crítica), inventário de licenças, SBOM, Gitleaks, build, GDD/PDF, ZIP/checksum e E2E local. Dependabot está preparado. Sem dependencies de produção; ferramentas estão em devDependencies.

Os jobs externos estão desabilitados por padrão. Somente após autorização do responsável, configurar:

1. Repositório público e Pages com origem **GitHub Actions**. A branch gh-pages guarda os snapshots e rollout.json. Publicação explícita evita depender de pushes com GITHUB_TOKEN para disparar Pages. É uma adaptação documentada ao exemplo da avaliação que usa origem por branch.
2. Environments homologacao e producao; producao deve exigir revisor humano e impedir autoaprovação. Permitir os refs autorizados nos ambientes. Verificar suporte no plano/repositório antes de ativar.
3. Proteger main: PR, uma revisão, check ci. Confirmar que a etapa prática em main é exceção autorizada.
4. SITE_URL sem barra final, por exemplo https://h6pw.github.io/SpellnSolve. Após autorizar, ENABLE_DEPLOY=true. ENABLE_RELEASE=true só após autorizar releases; ENABLE_MONITOR=true autoriza sondas e criação/fechamento de Issues. ENABLE_SUBMISSION=true permite a triagem manual; SUBMISSION_DEADLINE deve conter o horário real confirmado.

Homologação usa /hml/. Produção guarda o mesmo ZIP em /releases/<SHA completo>/, testa a versão verde e promove rollout.json. O carregador fixa a escolha na sessão e invalida versões retiradas. Smoke depois da troca confere o SHA; em falha, restaura anterior e republica. Primeira publicação não tem anterior e não oferece rollback: preparar duas versões boas antes do ensaio. rollback.yml permite restauração manual com gate. Não foi demonstrado prazo de recuperação inferior a cinco minutos.

A concorrência spell-pages serializa publicações, inclusive rollback. Se um workflow estiver em aprovação, outro pode continuar; a versão anterior é sempre a vigente no instante da promoção. Não reexecutar publicação imutável com artefato reconstruído: os arquivos devem ser idênticos. Relançar o mesmo SHA com metadata distinta é rejeitado.

## Observabilidade e submissão

monitor.yml sonda a cada 15 minutos e armazena sondas.csv e dora.json em observabilidade. Alertas JogoForaDoAr (HTTP != 200) e LatenciaAlta (>2 s) viram Issues reais, fechadas quando recuperam. Latência inclui página e version.json. /status/ usa dados públicos agregados, nunca dados do jogador. Schedules podem atrasar e dados da branch podem levar tempo para atualizar.

DORA usa jobs deploy-prd, datas de commits, marcadores de rollback, execuções manuais e Issues de alerta. Ausência de evidência fica null, sem números inventados. Frequência usa dias corridos; lead time usa data do committer; taxa exige revisão da correlação de rollback manual. Linha de base de lead time: 264 horas (11 dias). Usar janela de 30 dias por padrão; ajustar DORA_DAYS. A decisão de melhoria e seu efeito só podem ser registrados com medições reais.

Submissão: preparar pitch.mp4 e quatro membros; executar scripts/submission.py com SITE_URL ou submissao.yml com o run aprovado, artefato e URL HTTPS do pitch. scripts/triagem.sh exige PRAZO real, hashes, squad, PDF, vídeo até 90 s, ZIP, URL e smoke. Use Bash/Git Bash/WSL com pdfinfo/pdftotext, ffprobe e unzip. Não existe pacote final aprovado enquanto esses itens faltarem.

## Pendências de responsabilidade humana

Quatro nomes/RAs/papéis, revisão de IA, avaliação pedagógica e visual, revisão das notas, vídeo legendado, relatório técnico final em PDF com evidências, configurações de GitHub, execuções remotas, PRs reais, ensaio de rollback, dois alertas reais e métricas do período. Ver docs/relatorio.md e docs/pitch.md. Não criar aprovações ou contribuições retroativas.
O ZIP aprovado também fica preparado para publicação em /packages/<SHA>/build.zip; o workflow compara os bytes servidos com o artefato antes da promoção. Capturas locais: com preview aberto, execute node scripts/capture.mjs (BASE_URL opcional).

## Ajustes de dificuldade e áudio
Fácil: soma/subtração até 20, 46 px/s e intervalo 4,6 s. Médio: soma/subtração até 50 e multiplicação até 20 × 9, 62 px/s e 3,8 s. Difícil: soma/subtração até 99, multiplicação de 10–99 × 2–9, divisão exata com dividendo até 99, 78 px/s e 3 s. Música ambiente original e efeitos sintetizados com Web Audio; começam ao clicar em Jogar. Controles de música, efeitos e volume ficam no rodapé e são salvos no navegador. Aba oculta pausa o áudio; música encerra no menu/Game Over. Não há samples externos nem dependências novas.

## Licença e identidade visual

Em 09/10/2026, o responsável definiu h6pw como identificação na licença MIT. A logo gerada no ChatGPT foi incorporada ao README; origem e limites documentados em THIRD_PARTY.md. Materiais herdados de origem não confirmada continuam excluídos da build.
