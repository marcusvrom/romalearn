# Auditoria EDU-QA dos cursos — 3 de agosto de 2026

## Parecer executivo

**Resultado: 88/100 — aprovado para Beta controlada, condicionado à validação
com alunos e especialistas antes da venda ampla.**

O catálogo possui uma base editorial acima da média: 11 cursos com conteúdo
publicável, 95 leituras estruturadas, 29 práticas e projetos, 26 questionários
e 173 questões com feedback. O módulo de Inteligência Artificial permanece
honestamente em rascunho, sem conteúdo inventado.

A maior fragilidade encontrada não estava no volume do conteúdo, mas na
coerência da jornada: documentos e seeds discordavam sobre Git ou Lógica como
primeiro curso, Python e Java apareciam em uma lista linear, e a carga horária
somava as duas especializações. A revisão transformou o catálogo técnico em
uma história de quatro etapas, com evidências de portfólio e uma escolha real
no desfecho.

## Escopo e método

A avaliação aplicou o contrato EDU-QA às fontes de catálogo, aos conteúdos
estruturados, às atividades, rubricas, questionários, experiência pública da
trilha e modo áudio. Foram considerados:

- módulo gratuito de Carreira Digital;
- Windows, Word, Excel e PowerPoint;
- Git/GitHub, Lógica, HTML/CSS, JavaScript, Python e Java;
- módulo de IA, apenas para verificar o bloqueio editorial do rascunho.

| Dimensão EDU-QA               |    Peso |   Nota | Evidência principal                                                                                                       |
| ----------------------------- | ------: | -----: | ------------------------------------------------------------------------------------------------------------------------- |
| Arquitetura da aprendizagem   |      20 |     18 | Etapas, pré-requisitos e evidências agora explícitos; falta personalização diagnóstica.                                   |
| Correção e atualidade técnica |      25 |     21 | Conteúdo autoral e exemplos executáveis; revisão independente e matriz de versões ainda pendentes.                        |
| Didática e inclusão           |      20 |     18 | Problema antes do conceito, modelo mental, reflexão e linguagem acessível; requer observação com iniciantes.              |
| Exemplos e prática            |      20 |     18 | Práticas após preparação e projetos verificáveis; faltam repositórios-modelo e calibração de tempo.                       |
| Avaliação e domínio           |      15 |     13 | Rubricas públicas, falhas críticas e seis questões por curso técnico; falta calibrar itens e correção com entregas reais. |
| **Total**                     | **100** | **88** | **Pronto para Beta controlada.**                                                                                          |

## Arquitetura aprovada

### Trilha administrativa

1. autonomia no Windows;
2. documentos profissionais no Word;
3. decisões apoiadas por dados no Excel;
4. comunicação de resultados no PowerPoint;
5. IA responsável, somente depois que o conteúdo oficial existir.

O módulo gratuito de Carreira Digital funciona como porta de entrada e conecta
as ferramentas a emprego, evidências e presença profissional. O curso de IA
não aparece em uma trilha pública enquanto estiver em rascunho.

### Trilha de Desenvolvimento de Software

1. **Git/GitHub:** abre o caderno de bordo gratuito;
2. **Lógica:** transforma problemas em regras testáveis;
3. **HTML/CSS + JavaScript:** constrói e dá comportamento a uma solução web;
4. **Python ou Java:** escolhe automação e dados ou modelagem de sistemas.

Git antes de Lógica é uma decisão pedagógica e comercial deliberada: o aluno
cria primeiro o lugar onde registrará toda a evolução. Isso não diminui a
importância de Lógica como fundação conceitual. A interface identifica etapas
essenciais, a etapa de escolha e a evidência produzida em cada curso.

## Achados e correções obrigatórias

| Prioridade | Local e evidência                                                                         | Impacto no aluno                                                                    | Correção efetuada                                                                               | Critério de aceite                                                                         |
| ---------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| P0         | Programa publicado incluía relações com curso em rascunho.                                | Um card vazio de IA poderia prometer conteúdo inexistente.                          | A API filtra cursos não publicados ao montar qualquer trilha.                                   | Nenhum curso `DRAFT` aparece em programa público.                                          |
| P0         | O seed técnico criava texto genérico antes de sobrescrevê-lo com as 49 leituras autorais. | Uma falha intermediária podia deixar conteúdo repetitivo no banco.                  | O seed agora exige diretamente a aula autoral e falha se ela não existir.                       | 49 títulos no catálogo correspondem a 49 conteúdos únicos; ausência interrompe o seed.     |
| P1         | Git/Lógica tinham ordem e política comercial divergentes entre fontes.                    | O aluno recebia orientações conflitantes sobre por onde começar.                    | Git gratuito é etapa 1; Lógica paga é etapa 2 em código, documentação e interface.              | O teste editorial compara a ordem do catálogo com a jornada canônica.                      |
| P1         | Python e Java apareciam como sequência e suas horas eram somadas.                         | A trilha parecia maior e mais obrigatória do que realmente é.                       | As duas rotas compartilham um grupo alternativo; a API calcula 150–158 h.                       | A interface mostra “Escolha uma rota” e a faixa varia conforme a opção.                    |
| P1         | O leitor removia todo elemento `code` e ignorava tabelas.                                 | Termos técnicos desapareciam das frases e comparações ficavam incompletas no áudio. | Código inline é preservado, tabelas são verbalizadas e blocos longos são divididos.             | Uma aula pode ser percorrida em áudio sem perder termos, colunas ou contexto do exemplo.   |
| P1         | Conteúdo autoral técnico era apresentado como resumo de um e-book inexistente.            | A origem declarada era enganosa e reduzia confiança editorial.                      | A referência agora identifica material original RomaLearn e orienta documentação oficial.       | Nenhuma aula técnica afirma vir de e-book; módulos Office continuam com páginas de origem. |
| P1         | Projetos técnicos recebiam temporariamente uma rubrica incompatível com o corretor.       | Uma interrupção do seed podia impedir ou distorcer a correção.                      | A rubrica nasce no contrato final: cinco critérios, 100 pontos, 120 palavras e falhas críticas. | O primeiro seed já grava uma `ActivityRubricDto` válida.                                   |
| P2         | Questionários técnicos tinham apenas três questões finais.                                | Cobertura fraca permitia aprovação por acerto casual.                               | Cada curso técnico passa a ter seis questões com explicação.                                    | Seis ou mais itens, uma resposta correta e feedback por item.                              |
| P2         | Áreas técnicas já publicadas ainda apareciam como “planejadas”.                           | A descoberta do catálogo contradizia a oferta disponível.                           | Fundamentos, Web e Backend foram marcados como disponíveis.                                     | Taxonomia e catálogo público exibem o mesmo estado.                                        |

## Pontos fortes por família

### Carreira e produtividade

- 46 leituras ligadas aos e-books oficiais, com capítulo e páginas;
- avaliações distribuídas: quatro questionários por curso;
- rubricas, exemplos de entrega forte e fraca e regras de anexo;
- progressão do uso básico do computador à comunicação de resultados;
- módulo gratuito com seis práticas, adequado à ativação inicial.

### Desenvolvimento de software

- 49 leituras escritas uma a uma, todas abertas por um problema concreto;
- exemplos de código, resultados esperados, erros comuns, reflexão e checklist;
- três práticas por curso e projeto final conectado ao portfólio;
- carga e pré-requisitos declarados;
- narrativa transversal sustentada pelo mesmo repositório desde a etapa gratuita.

## Bloqueios antes do lançamento amplo

1. Executar todos os comandos e projetos em Windows, macOS e Linux quando aplicável, com revisão por especialista independente.
2. Observar pelo menos cinco alunos iniciantes por trilha e recalibrar linguagem, tempo e pontos de abandono.
3. Corrigir três entregas reais por projeto para calibrar rubricas, nota de corte e exemplos.
4. Testar o modo áudio em Chrome, Edge, Safari/iOS e Android, incluindo VoiceOver, TalkBack e NVDA.
5. Criar repositórios iniciais e soluções comentadas para os seis cursos técnicos.
6. Manter o módulo de IA fora do catálogo até possuir fonte, aulas, práticas, avaliação e revisão técnica completas.

## Portão automatizado

Os testes `platform-content-quality.spec.ts` e
`technology-content-quality.spec.ts` impedem regressões de ordem, autoria,
quantidade de conteúdo, posicionamento das práticas, rubricas e cobertura dos
questionários. Eles complementam, mas não substituem, revisão humana e teste
com alunos.
