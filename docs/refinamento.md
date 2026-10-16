# Refinamento do bosque encantado — 16/10/2026

## Estado inicial e escopo

Branch inicial main; checkout limpo; HEAD 3f14632added95493b3a69adc4ae883896680487. Sem AGENTS.md encontrado no checkout ou diretórios ancestrais consultados. Branch de trabalho codex/enchanted-forest. Nenhuma mudança preexistente, configuração externa, dependência ou workflow alterado.

A curva de dificuldade e o relógio da simulação foram preservados (delta máximo de 50 ms, mesma velocidade, intervalo, vidas e pontuação). Recordes mantêm o formato existente. Um único requestAnimationFrame é iniciado na entrada da aplicação; reinícios apenas substituem o estado. Atualizações de texto, atributos e propriedades DOM comparam o valor anterior; posições das etiquetas mudam por frame e no resize.

## Resultado integrado

Página ambientada, árvores em camadas, lua, arco, névoa baixa, moldura e materiais compartilhados. Menu com grimórios e gato ampliado; encerramento com estado derrotado e resumo. Três criaturas com ID, variante e fase estáveis. Eventos e snapshots de dissolução saem da lista de alvos imediatamente. Recursos transitórios limitados: 12 efeitos e 32 eventos; o adaptador consome a fila de eventos.

Combos visuais em 3/5/10, melhor sequência, sem bônus nos pontos. Formato inválido não quebra combo; inteiro sem alvo e dano quebram. Pausa explícita ou aba oculta congela timers e coordena áudio; pausa manual sobrevive à volta da aba. Enter e botão compartilham submissão, mantendo/selecionando erros e limpando acertos.

Expressões em etiquetas DOM com 16–17 px mínimos, IDs, líderes e empacotamento. Lista de contas na ordem de aproximação e urgência identificada. Canvas preserva 16:9. Movimento reduzido consulta a preferência também no desenho. Região de status muda apenas em eventos, não a cada frame.

## Verificação

Resultados finais são registrados em docs/evidencias.md; o checksum final fica em artifacts/build.zip.sha256. Capturas e vídeo em reports/refinement/, reproduzíveis com preview aberto em 4174 e node scripts/capture.mjs (BASE_URL opcional). Capturas usam relógio e gerador aleatório controlados; a medição de frames e a sequência do feitiço usam relógio real em uma segunda página.

## Limitações

Chromium desktop automatizado; sem telefone físico/teclado virtual real, Safari, Firefox, leitor de tela ou avaliação com usuários. Zoom de 200% validado por viewport CSS equivalente, sem afirmar zoom nativo inspecionado. A pausa automática em teste usa visibilitychange simulado. Medição local curta não representa desempenho em celulares. Arte e ritmo ainda dependem de avaliação humana. O vídeo registra a execução; não comprova aprovação artística.

## Comparação e reversão

Comparar: git diff 3f14632..codex/enchanted-forest e git log --oneline 3f14632..codex/enchanted-forest. Para ver a versão anterior, com árvore limpa, git switch main; para voltar ao refinamento, git switch codex/enchanted-forest. O commit local desta implementação pode ser desfeito com git revert usando seu hash exato (consultar o log), preservando o histórico. Não usar reset --hard nem checkout de arquivos sobre alterações não salvas. Nada foi publicado nesta rodada; a versão online não muda.
