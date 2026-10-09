# Evidências dos dez integráveis

Verificações locais em 09/10/2026 (America/Sao_Paulo). Workspace com alterações anteriores e novas não commitadas; HEAD 512380c40e5ece88775781daee4e357c04ec11ca. version.json registra dirty:true. Não houve commit, push, merge, deploy ou release nesta implementação.

## Resultados executados

- Antes da implementação: dez testes existentes passaram. Todos foram mantidos; um cenário explícito de divisão foi acrescentado ao arquivo original.
- npm ci --offline: instalação limpa concluída com lockfile após encerrar o Vite que bloqueava o módulo nativo no Windows. Não exigiu alteração de dependências de produção.
- npm run lint: passou. Artefatos/tmp são excluídos do lint; src/counter.js é exemplo herdado não utilizado.
- npm run content:validate: passou em Node nativo. Bug ERR_IMPORT_ATTRIBUTE_MISSING corrigido e protegido por teste de subprocesso.
- npm run test:ci: 53 testes aprovados (42 unitários, 11 de integração). JUnit em reports/junit.xml. Cobertura de src/core/: linhas 98,52%, statements 98,85%, branches 98,57%, functions 100%; thresholds de 70% ativos.
- Playwright/Chromium: cinco cenários aprovados contra o preview local; os três cenários originais também haviam passado contra o ZIP descompactado servido por node serve.mjs em loopback. Completar primeira onda, Game Over por três colisões, reinício, recorde após reload, dificuldade difícil, entrada vazia, largura mobile e smoke. JUnit reports/e2e.xml, relatório playwright-report/index.html. Firefox/WebKit e aparelhos reais não foram verificados.
- npm run build: aprovado em Vite 8.3.4. Dois builds do mesmo estado local com SOURCE_DATE_EPOCH fixo geraram todos os arquivos dist e ZIP idênticos. Comparação em scripts/reproducibility.py; não equivale a dois clones do commit antigo, porque há alterações locais.
- Build.zip atualizado: 10.594 bytes, íntegro, extraído e jogável sem internet/npm via servidor Node incluso. Checksum confirmado. SHA-256: 76de4eff96f15ec2e8a9bf5963b23071820de2bafc96da4e1972b6d66ed713b9. Abrir por file:// não é suportado.
- GDD.pdf atualizado: três páginas, gerado por ReportLab 4.4.9, reaberto por pypdf/PDFium com seções obrigatórias e revisão das páginas renderizadas. Os wrappers Poppler locais apontam para caminho indisponível; pdfinfo fica preparado no CI Linux e não foi executado com sucesso localmente.
- Capturas reais: reports/screenshots/menu.png, game.png, mobile.png, gameover.png. Inspeção visual desktop/mobile e PDF realizada pelo agente; aprovação humana pendente.
- npm audit --omit=dev --audit-level=critical: zero vulnerabilidades reportadas; reports/audit.json.
- SBOM CycloneDX gerado: reports/sbom.json. Inventário: 152 entradas do lock com licença declarada, reports/licenses.json. Decisão da licença própria ainda pendente.
- Gitleaks 8.30.1: cinco commits e snapshot dos arquivos atuais, sem segredos encontrados; reports/gitleaks-history.json e gitleaks-workingtree.json. Downloads oficiais com SHA-256 conferido.
- Actionlint 1.7.12: workflows passaram na validação estática de sintaxe/expressões/actions. ShellCheck e Pyflakes não estavam disponíveis e foram desativados no comando; scripts Bash e jobs Ubuntu ainda exigem execução no runner.
- Integração local de publicação: promoção, rollback do ponteiro e rejeição de conteúdo divergente no mesmo SHA aprovados. Nenhum snapshot foi enviado ao GitHub.

## Matriz de aceite

| ID | Preparado / verificado localmente | Falta para comprovar o integrável |
|---|---|---|
| INT-01 Git | Histórico inspecionado, estrutura preservada, fluxo documentado e SQUAD.md preparado | Quatro dados reais, dez PRs revisados, contribuições em três integráveis por membro, proteção de main e tags anotadas |
| INT-02 GDD | Markdown atualizado e PDF gerado, reaberto e conferido | Publicar artefato do CI e revisão do squad; atualizar versão para a tag final |
| INT-03 CI/CD | Workflows e comandos locais, Actionlint sem erros | Execução verde em clone/runner Ubuntu; configurar ambientes/checks; medir push até hml <=15 min |
| INT-04 Testes | 42 unitários, 11 de integração, cinco E2E, JUnit/cobertura e regressão de bug real | Repetir E2E em homologação e smoke público; CI como gate do PR |
| INT-05 Segurança/licenças/IA | Gitleaks, auditoria, SBOM, inventário e registro de IA | Licença própria, revisão humana, confirmar direitos do material herdado antes de reutilizar e executar segurança no CI |
| INT-06 Release | version.json, ZIP 10.594 bytes e checksum, reprodução local e offline | Tag SemVer, revisão de notas, Release com anexos e comparar ZIP servido em produção com ZIP da release |
| INT-07 Ambientes/rollback | /hml/, release imutável, loader, azul-verde, smoke de SHA e workflows de rollback | Configurar Pages/ambientes/revisor, publicar duas versões boas, induzir falha autorizada e medir recuperação <5 min |
| INT-08 Monitor/DORA | Sondas/Issues/painel e cálculo a partir de API real implementados | Ativar após autorização, obter dois alertas reais com recuperação, medir DORA e decisão de melhoria |
| INT-09 Submissão | Script de pacote, manifesto e triagem estrita preparados | URL pública, quatro membros, horário real, pitch e triagem aprovada; pacote final ainda não gerado |
| INT-10 Comunicação | Rascunho do relatório e roteiro de até 90 s | Capturar gameplay de produção, gravar/legendar pitch e gerar relatório PDF final com evidências e contribuições |

## Decisões pendentes do responsável

Membros (nome, RA, papel), licença do código/arte, horário do prazo, revisão humana da IA e arte, autorização de configurações e publicações GitHub. A pergunta foi enviada durante o trabalho; nenhuma resposta foi presumida. SQUAD.md e LICENSE expõem a pendência e não comprovam aprovação.

Pages será configurado para publicar explicitamente via Actions, preservando snapshots em gh-pages; é adaptação ao exemplo por branch da avaliação. Os jobs externos estão bloqueados até ENABLE_DEPLOY/RELEASE/MONITOR/SUBMISSION serem autorizados e configurados. Somente o CI local e a validação estática foram executados; os dez integráveis não estão declarados concluídos.

URLs oficiais usadas para conferir o preparo: https://playwright.dev/docs/clock, https://main.vitest.dev/config/reporters, https://github.com/actions/setup-node/releases, https://github.com/actions/upload-artifact/releases, https://github.com/actions/download-artifact/releases, https://github.com/actions/upload-pages-artifact/releases, https://github.com/actions/deploy-pages/releases, https://github.com/gitleaks/gitleaks-action/releases e https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages.


## Revisão autorizada de layout, dificuldade e áudio
Faixa superior corrigida: margem externa removida, fundo no elemento raiz e altura da interface adaptada às janelas maiores. Teste em 1920 × 958 confirmou todo o conteúdo sem rolagem vertical; telas menores continuam podendo rolar. Arte preservada.
Dificuldade: Fácil +/− até 20; Médio +/− até 50 e × até 20 × 9; Difícil +/− até 99, × de 10–99 por 2–9 e ÷ com resto zero. Ritmos iniciais 46/62/78 px/s e intervalos 4,6/3,8/3 s. Testes antigos mantidos, com limites atualizados para o rebalanceamento autorizado; novos testes cobrem fatores e divisões.
Áudio: melodia original de fantasia com sinos/acordes e cinco efeitos sintetizados, sem arquivos externos ou novas dependências. Web Audio inicia em interação, suspende na aba oculta e permite música/efeitos separados e volume persistente. Testes de ciclo de áudio e E2E verificaram contexto running e sinal não nulo no analisador real do Chromium. A preferência subjetiva pela composição depende de ouvir a partida; não houve teste em navegadores móveis reais.
PDF atualizado reaberto e páginas renderizadas. README, GDD, THIRD_PARTY e AI-USAGE atualizados. Nenhum push, deploy ou release foi realizado.
Verificação final desta revisão: o ZIP atualizado foi descompactado e passou no smoke e no cenário de áudio no servidor Node incluso. Dois builds finais com SOURCE_DATE_EPOCH fixo produziram dist e ZIP idênticos. Lint passou; o relatório completo mantém cinco E2E aprovados.

## Atualização documental — licença e logo

Em 09/10/2026, após os registros históricos acima, o responsável definiu h6pw como identificação na licença MIT e informou a geração da logo no ChatGPT. LICENSE e metadados npm atualizados; logo original copiada ao README, sem alteração no jogo. A pendência de escolha da licença própria foi resolvida. Isso não substitui revisão humana nem validações remotas de INT-05.
