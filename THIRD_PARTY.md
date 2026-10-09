# Recursos, autoria e licenças

## Recursos efetivamente distribuídos no jogo

| Recurso | Autor/origem | Licença e direitos | Uso |
|---|---|---|---|
| Gato, criaturas, cenário, partículas | Código original em src/game/render.js, assistido por Codex em 09/10/2026 | Decisão da licença própria pendente do titular (LICENSE) | Canvas, sem arquivos externos |
| Interface, textos, CSS | Projeto original e implementação assistida por Codex | Decisão da licença própria pendente | Interface |
| Música ambiente e efeitos | Composição e síntese originais em src/game/audio.js, assistidas por Codex | Decisão da licença própria pendente, sem samples externos | Web Audio em tempo real |
| Fontes | Fontes já instaladas no sistema operacional | Não redistribuídas | system-ui e Georgia |

Não há áudio gravado, samples, imagens externas, CDN de fontes ou recursos de terceiros carregados pelo jogo. A música e os efeitos são sintetizados por código original, sem cópia de melodias ou gravações de terceiros. A decisão da licença própria é um bloqueio documental: não declarar INT-05 concluído enquanto LICENSE não for definido.

## Ferramentas diretas de desenvolvimento

Licenças abaixo conferidas em package.json e arquivos LICENSE dos pacotes instalados. Versões exatas e dependências transitivas: package-lock.json, reports/licenses.json e reports/sbom.json gerados pela esteira. Os avisos dos pacotes permanecem em node_modules; nenhum desses pacotes é uma dependency de produção.

| Biblioteca | Autor | Origem | Licença | Uso |
|---|---|---|---|---|
| Vite 8.3.4 | Evan You e contribuidores | https://github.com/vitejs/vite | MIT | servidor/build |
| Vitest 5.0.3 | Anthony Fu e contribuidores | https://github.com/vitest-dev/vitest | MIT | unidade/integração |
| @vitest/coverage-v8 5.0.3 | equipe Vitest | https://github.com/vitest-dev/vitest | MIT | cobertura |
| Playwright 1.64.0 | Microsoft | https://github.com/microsoft/playwright | Apache-2.0 | E2E/smoke e Chromium para teste |
| ESLint 10.12.0 e @eslint/js 10.0.1 | Nicholas C. Zakas/equipe ESLint | https://github.com/eslint/eslint | MIT | lint |
| ReportLab 4.4.9 | ReportLab e contribuidores | https://www.reportlab.com/ | BSD | PDF, requirements-dev.txt |
| GitHub Actions oficiais | GitHub | https://github.com/actions | MIT, conforme cada action | CI/CD |
| Gitleaks/action | Gitleaks e contribuidores | https://github.com/gitleaks/gitleaks-action | MIT, conforme repositório | varredura de segredos |

Transitivos declarados no lock: MIT, Apache-2.0, BSD-2-Clause, BSD-3-Clause, ISC, MPL-2.0 e BlueOak-1.0.0. São ferramentas de desenvolvimento; consultar obrigações por pacote antes de redistribuí-las. O inventário não é parecer jurídico e não concede licença ao código próprio.

## Arquivos herdados, preservados e excluídos da build

src/assets/hero.png, javascript.svg, vite.svg e public/icons.svg/favicon.svg vieram do template inicial do Vite. Algumas origens específicas e direitos do hero/icons ainda não foram comprovados: não reutilizar nem redistribuir na build pública até confirmação. src/counter.js é o exemplo antigo do template e está sem uso. Vite está com publicDir:false, portanto public/ não entra em dist. Nenhum dos assets é importado.

docs/Avaliação.html é material da Faculdade SENAI fornecido pelo aluno; contém logos, fontes e referências externas que não foram licenciados para o jogo. Preservado como requisito, excluído da build. Não o tratar como arte própria.
`Actionlint 1.7.12` (rhysd, MIT, https://github.com/rhysd/actionlint) e `Gitleaks CLI 8.30.1` (Gitleaks, MIT, https://github.com/gitleaks/gitleaks) foram baixados dos releases oficiais com checksums conferidos para validar localmente. Ficam em tmp/tools, fora da build.
