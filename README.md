# ✨ Spell & Solve

<p align="center">
  <img src="docs/assets/logo.png" alt="Spell & Solve — gato mago e símbolos matemáticos" width="820">
</p>

> Pequenas contas. Grandes feitiços.

Um jogo educativo de fantasia: ajude um gato mago a defender seu bosque resolvendo contas antes que as criaturas se aproximem. Desenvolvido para a avaliação de Integração e Entrega Contínua do segundo semestre de ADS.

**JavaScript ES Modules · HTML5 Canvas · Vite · Vitest · Playwright · GitHub Actions**

[Como jogar](#-como-jogar) · [Executar](#-executar-no-computador) · [Publicação online](#-jogar-online) · [Documentação](#-documentação) · [Licença](#-autoria-e-licença)

## 🎮 Como jogar

1. Escolha a dificuldade e clique em **Jogar**.
2. Digite o resultado de uma conta e pressione **Enter** ou **Lançar**.
3. Defenda o gato: cada criatura que o alcança remove uma das **três vidas**.

| Dificuldade | Operações | Limites das contas |
| --- | --- | --- |
| Fácil | Soma e subtração | Números até 20 |
| Médio | Soma, subtração e multiplicação | Soma/subtração até 50; multiplicação até 20 × 9 |
| Difícil | Todas as operações | Soma/subtração até 99; multiplicação de 10–99 × 2–9; divisão exata com dividendo até 99 |

Cada acerto vale **10 pontos × onda**. A cada cinco acertos, as criaturas ficam mais rápidas e frequentes. Se duas contas têm a mesma resposta, o feitiço atinge a criatura mais próxima. Respostas erradas não retiram vidas.

O recorde fica salvo no navegador. Música ambiente, efeitos e volume têm controles próprios. A partida e o áudio pausam quando a aba fica oculta. Sem cadastro, banco de dados ou ranking online.

## 🌐 Jogar online

O jogo é compatível com **GitHub Pages**. A publicação está preparada, mas configurar o workflow não comprova que o site já esteja no ar.

Endereço previsto após a ativação: `https://h6pw.github.io/SpellnSolve/`.

Para ativar a publicação, o responsável deve:

1. Em **Settings → Pages → Build and deployment**, selecionar **GitHub Actions**.
2. Criar os environments `homologacao` e `producao`, com revisão humana em produção quando disponível no plano.
3. Em **Settings → Secrets and variables → Actions → Variables**, definir `SITE_URL=https://h6pw.github.io/SpellnSolve` e `ENABLE_DEPLOY=true`.
4. Executar a esteira e acompanhar os testes da homologação e a aprovação de produção.

A homologação usa `/hml/`. Produção reutiliza o mesmo pacote, verifica a versão e permite rollback depois de existir uma versão anterior. Releases e monitoramento têm ativações independentes. [Consulte o guia completo](docs/desenvolvimento.md#cicd-e-autorização).

## 💻 Executar no computador

### Desenvolver a partir do código

Requisitos: **Node.js 24.13.1** e **npm 11**.

```sh
npm ci
npm run dev
```

Abra o endereço informado pelo Vite. Para verificar o projeto:

```sh
npm run lint
npm run content:validate
npm run test:ci
npm run build
npm run test:e2e
```

Antes do primeiro E2E, instale o navegador de teste com `npx playwright install chromium`. Os requisitos de PDF e os demais comandos estão no [guia de desenvolvimento](docs/desenvolvimento.md).

### Jogar a partir do ZIP

`artifacts/build.zip` é o **jogo compilado**, não o código-fonte para desenvolvimento. Ele é gerado pelo build e pelo empacotamento e também pode ser obtido nos artefatos de uma execução bem-sucedida da CI.

1. Extraia **todos** os arquivos do ZIP para uma pasta.
2. Com Node.js instalado, abra um terminal nessa pasta e execute `node serve.mjs`.
3. Acesse **http://127.0.0.1:4173** e mantenha o servidor aberto enquanto joga.

Não precisa de internet nem de `npm install`. Abrir `index.html` com dois cliques não é suportado: os módulos ES precisam de HTTP. Para jogar sem terminal ou instalação, use a publicação no GitHub Pages.

O `build.zip.sha256` permite verificar a integridade do pacote. Os arquivos de `artifacts/` são gerados e não entram no Git.

## 🧪 Qualidade e entrega

A suíte preserva os dez testes unitários originais e cobre regras, integração, interface e áudio. A última validação local registrada contém **53 testes de unidade/integração e 5 E2E**; consulte as [evidências](docs/evidencias.md) para contexto e limitações. Isso não substitui o resultado de uma execução remota.

A CI está preparada para lint, JUnit, cobertura, build, PDF do GDD, auditoria de dependências, Gitleaks, SBOM e ZIP com SHA-256. Deploy, releases, monitoramento e submissão dependem de configuração e evidências reais.

## 📁 Estrutura

```text
src/
  core/           Matemática, desafios e estado
  content/        Configuração das dificuldades
  game/           Inimigos, Canvas, entradas, armazenamento e áudio
  main.js         Interface e ciclo do jogo
  style.css       Estilos responsivos
tests/
  unit/           Testes unitários
  integration/    Integração e scripts
  e2e/            Jornadas de navegador e smoke tests
docs/             GDD, evidências e documentação técnica
scripts/          Build, pacote, publicação e observabilidade
.github/workflows/ CI/CD e tarefas automatizadas
```

## 📚 Documentação

| Documento | Conteúdo |
| --- | --- |
| [GDD](docs/gdd.md) | Conceito, mecânicas e critérios de aceitação |
| [Guia de desenvolvimento](docs/desenvolvimento.md) | Comandos, CI/CD, rollback, DORA e submissão |
| [Evidências](docs/evidencias.md) | Verificações executadas e pendências |
| [Relatório técnico](docs/relatorio.md) | Base para o relatório da avaliação |
| [Pitch](docs/pitch.md) | Roteiro da apresentação |
| [Squad](SQUAD.md) | Integrantes e responsabilidades a preencher |
| [Uso de IA](AI-USAGE.md) | Registro da assistência e revisão humana |
| [Recursos e licenças](THIRD_PARTY.md) | Origem e direitos dos recursos |

## 📝 Autoria e licença

Código e recursos próprios sob a [licença MIT](LICENSE), com identificação `h6pw`. A logo foi fornecida pelo responsável e gerada no ChatGPT; o modelo não foi informado. As dependências e os materiais de terceiros mantêm suas próprias licenças, documentadas em [THIRD_PARTY.md](THIRD_PARTY.md).

Antes da entrega final, faltam dados reais do squad, revisão humana, vídeo, relatório final e evidências dos fluxos remotos. Essas pendências estão detalhadas na documentação.
