# Relatório técnico - rascunho factual

Data da implementação: 09/10/2026. Responsável humano e revisão: pendentes. Este arquivo não é o PDF final de até 12 páginas exigido pela avaliação.

## Problema e solução
O repositório tinha aritmética, gerador e dez testes, com uma animação incompleta. Foi implementado o ciclo arcade em Canvas e uma esteira que prepara, testa e promove um artefato único. Menu, combate, progressão, vidas, derrota, reinício e recorde usam lógica separada da renderização.

## Decisões
Preservar JavaScript ES/Vite e gerador original. Canvas programático original evita imagens com direitos desconhecidos; mantém recursos antigos sem distribuí-los. JSON validado em código dispensa dependência de validação de esquema. ReportLab gera o GDD sem engine TeX. ZIP usa biblioteca padrão Python. Azul-verde reduz a complexidade do canário mantendo ponteiro reversível. Pages é publicado pelo Actions, pois push com GITHUB_TOKEN não dispara build por branch. A branch gh-pages preserva o histórico operacional.

## Bug real e regressão
npm run content:validate falhou com ERR_IMPORT_ATTRIBUTE_MISSING: a importação JSON funcionava no Vite/Vitest, mas não no Node nativo. Corrigido com with { type: 'json' }. Teste de integração executa a CLI em processo Node para impedir regressão. Também corrigido relógio do E2E que tentava retroceder no tempo; era falha do teste, não do jogo.

## Validação e evidências
Resultados executados e limites constam em docs/evidencias.md. Dez testes originais preservados, sem exclusões. Não houve teste pedagógico com público-alvo, revisão externa de acessibilidade ou aprovação humana das notas de versão.

## DORA e retrospectiva
Sem deploys executados, não há métricas reais do período nem comparação medida. scripts/dora.mjs calcula os dados depois da autorização de monitoramento. Linha de base: 11 dias. Decisão inicial: automatizar testes, conteúdo e pacote para reduzir trabalho manual; efeito ainda não medido. Registrar resultado após janela observada, incluindo atraso de schedules, falhas e tempo real de recuperação.

## Contribuições e comunicação
Não atribuir commits da IA ou histórico a quatro pessoas sem evidência. Preencher SQUAD.md e links de PRs reais; pelo menos três integráveis por membro e dez PRs revisados no total. Roteiro de vídeo em docs/pitch.md. Gravação, legendas e relatório PDF final dependem do squad e da URL de produção.

## Pendências
Revisão humana, licença própria, membros, configurações GitHub, CI remoto, homologação/produção, SemVer e release, rollback abaixo de cinco minutos, dois alertas reais, DORA, pitch, PDF final e triagem completa. Não foram simulados resultados dessas atividades.
