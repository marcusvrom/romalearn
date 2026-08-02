import { LessonType, QuestionType } from '@romalearn/contracts';
import type { SeedLesson, SeedQuestion } from '../catalog-data';
import { ActivityRubric, LessonContent } from './content-types';
import type { SeedSection } from '../catalog-data';

/**
 * Módulo Extra Gratuito — Carreira Digital e Destaque Profissional.
 *
 * Conteúdo extraído do e-book oficial (Edição 2026, 24 páginas). Cada aula
 * indica o capítulo e as páginas de origem. As rubricas vêm da tabela
 * "Critérios de avaliação" do projeto final (páginas 21–22) e das listas
 * "Conferir:" de cada capítulo.
 */

const EBOOK = 'Módulo Extra Gratuito';

/** Uma pergunta de múltipla escolha simples. */
const QUESTAO = (
  statement: string,
  explanation: string,
  options: [string, boolean][],
): SeedQuestion => ({
  statement,
  type: QuestionType.SINGLE_CHOICE,
  explanation,
  options: options.map(([text, isCorrect]) => ({ text, isCorrect })),
});

// ---------------------------------------------------------------------------
// Parte 1 — Conhecimento que vira valor
// ---------------------------------------------------------------------------

const CAP_1: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Capítulo 1 — Tecnologia e o mercado de trabalho',
    pages: '6–8',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Entenda por que conhecimentos digitais ajudam em muitas profissões e como eles se combinam com habilidades humanas.',
    },
    { kind: 'heading', text: 'O trabalho já é digital, mesmo fora da área de TI' },
    {
      kind: 'paragraph',
      text: 'Muitas rotinas de escritório, comércio, escola, saúde, atendimento e serviços usam arquivos digitais, documentos, planilhas, apresentações e sistemas online. Por isso, saber usar tecnologia é útil mesmo quando o nome do cargo não contém a palavra tecnologia.',
    },
    {
      kind: 'paragraph',
      text: 'O Future of Jobs Report 2025, do Fórum Econômico Mundial, coloca letramento tecnológico entre as competências que crescem mais rapidamente, junto de IA, dados, redes e segurança. O relatório também mantém pensamento analítico, criatividade, colaboração, resiliência e aprendizagem contínua como capacidades importantes.',
    },
    {
      kind: 'analogy',
      text: 'Tecnologia é uma caixa de ferramentas. Habilidades humanas ajudam a entender o problema, escolher a ferramenta, conversar com as pessoas e conferir se o resultado faz sentido.',
    },
    { kind: 'heading', text: 'O que é letramento tecnológico' },
    {
      kind: 'paragraph',
      text: 'Letramento tecnológico é usar ferramentas digitais com compreensão, segurança e senso crítico. Não é decorar todos os menus. É saber o que a ferramenta faz, quando ela ajuda, quais cuidados exige e onde procurar apoio.',
    },
    {
      kind: 'table',
      headers: ['Situação', 'Conhecimento digital', 'Habilidade humana'],
      rows: [
        ['Organizar documentos', 'Pastas, nomes e versões', 'Atenção e responsabilidade'],
        ['Criar um relatório', 'Word e PDF', 'Clareza e escrita'],
        ['Acompanhar despesas', 'Excel e fórmulas', 'Análise e conferência'],
        ['Apresentar uma ideia', 'PowerPoint', 'Comunicação e empatia'],
        ['Usar IA', 'Prompts e ferramentas', 'Julgamento e ética'],
      ],
    },
    { kind: 'heading', text: 'Os cinco degraus da proficiência' },
    {
      kind: 'warning',
      text: 'Saber abrir uma ferramenta não é o mesmo que ter proficiência. A evolução acontece com prática, repetição, compreensão e evidência.',
    },
    {
      kind: 'table',
      headers: ['Degrau', 'O que significa', 'Pergunta de conferência'],
      rows: [
        ['1. Reconhecer', 'Sei para que serve.', 'Consigo explicar com palavras simples?'],
        ['2. Executar', 'Concluo uma tarefa com apoio.', 'Cheguei ao resultado correto?'],
        ['3. Repetir', 'Faço novamente com consistência.', 'Dependo de copiar cada passo?'],
        ['4. Explicar', 'Ensino e justifico escolhas.', 'Sei explicar erros e limites?'],
        ['5. Melhorar', 'Reduzo erro, tempo ou retrabalho.', 'Tenho evidência da melhoria?'],
      ],
    },
    { kind: 'heading', text: 'O diferencial aparece na aplicação' },
    {
      kind: 'paragraph',
      text: "Em vez de dizer apenas 'sei Excel', uma pessoa pode explicar: 'Criei uma planilha de estudo para controlar despesas, apliquei filtros e conferi os totais por dois métodos'. A segunda frase mostra uma entrega e permite perguntas mais concretas.",
    },
    {
      kind: 'paragraph',
      text: 'Conhecimento de tecnologia ajuda a pessoa a produzir com mais organização e autonomia. Com IA, ela também pode preparar rascunhos e explorar ideias com rapidez. O destaque profissional, porém, depende da qualidade final e da capacidade de explicar o que foi conferido.',
    },
    { kind: 'heading', text: 'O que este aprendizado pode e não pode prometer' },
    {
      kind: 'table',
      headers: ['Pode ajudar a', 'Não pode garantir'],
      rows: [
        ['Melhorar preparo e autonomia', 'Contratação'],
        ['Criar evidências e portfólio', 'Salário específico'],
        ['Comunicar competências com clareza', 'Promoção'],
        ['Descobrir lacunas de aprendizagem', 'Aprovação em processo seletivo'],
        ['Usar IA com mais responsabilidade', 'Resposta sempre correta'],
      ],
    },
  ],
  summary: [
    'Tecnologia não é assunto apenas de quem trabalha em TI.',
    'Conhecimento técnico ganha valor quando resolve um problema real.',
    'Ferramentas digitais e habilidades humanas se complementam.',
  ],
};

const CAP_2: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Capítulo 2 — Da habilidade à evidência profissional',
    pages: '9–10',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Transforme estudo e prática em entregas que outras pessoas conseguem compreender e verificar.',
    },
    { kind: 'heading', text: 'Competência precisa deixar um rastro' },
    {
      kind: 'paragraph',
      text: 'Uma evidência profissional é algo que outra pessoa consegue observar, abrir, ler, testar ou perguntar. Pode ser um arquivo, um projeto, um checklist, uma apresentação, uma explicação do processo ou um resultado real que você tem permissão para mostrar.',
    },
    {
      kind: 'analogy',
      text: 'Dizer que sabe cozinhar é uma informação. Preparar o prato, explicar a receita e mostrar como conferiu o ponto são evidências.',
    },
    { kind: 'heading', text: 'Como cada módulo pode gerar uma evidência' },
    {
      kind: 'paragraph',
      text: 'O módulo gratuito mostra por que essas entregas importam. Os cinco módulos pagos ensinam como construí-las com progressão, prática e projetos completos.',
    },
    {
      kind: 'table',
      headers: ['Módulo', 'Conhecimento', 'Evidência inicial'],
      rows: [
        ['1. Computação e Windows', 'Organização e segurança', 'Estrutura de pastas e checklist'],
        ['2. Microsoft Word', 'Documentos profissionais', 'Currículo ou relatório padronizado'],
        ['3. Microsoft Excel', 'Controles e análise', 'Planilha com fórmulas, filtros e gráfico'],
        ['4. Microsoft PowerPoint', 'Comunicação visual', 'Apresentação curta de projeto'],
        [
          '5. Inteligência Artificial',
          'Apoio responsável',
          'Prompt, resposta, revisão e versão aprovada',
        ],
      ],
    },
    { kind: 'heading', text: 'A fórmula de uma boa descrição' },
    {
      kind: 'template',
      label: 'Modelo para preencher',
      text: 'ação + ferramenta + problema + entrega + resultado verificável',
    },
    {
      kind: 'paragraph',
      text: 'Não é obrigatório ter um número. Quando houver número, ele precisa ser verdadeiro e explicável.',
    },
    {
      kind: 'table',
      headers: ['Versão fraca', 'Versão com evidência'],
      rows: [
        [
          'Tenho conhecimento de Word.',
          'Padronizei um relatório de estudo no Word usando estilos, sumário e revisão final em PDF.',
        ],
        [
          'Sei Excel.',
          'Criei uma planilha fictícia de despesas, usei fórmulas e filtros e conferi os totais por dois métodos.',
        ],
        [
          'Uso IA.',
          'Usei IA para rascunhar um e-mail, corrigi duas informações e finalizei a versão aprovada no Word.',
        ],
      ],
    },
    { kind: 'heading', text: 'Projeto de estudo não é experiência inventada' },
    {
      kind: 'paragraph',
      text: 'Quem está começando pode criar projetos fictícios para aprender. O projeto deve ser identificado como exercício ou estudo. Nunca apresente uma empresa, cliente, cargo ou resultado inventado como experiência real.',
    },
    { kind: 'heading', text: 'Estrutura de um miniportfólio' },
    {
      kind: 'steps',
      items: [
        'Situação: qual problema foi simulado ou resolvido?',
        'Objetivo: o que a entrega precisava alcançar?',
        'Ferramentas: o que foi usado e por quê?',
        'Processo: quais foram os passos principais?',
        'Entrega: qual arquivo ou resultado foi produzido?',
        'Verificação: como os dados, o texto e a apresentação foram conferidos?',
        'Aprendizado: o que você melhoraria na próxima versão?',
      ],
    },
  ],
  checklist: [
    'O projeto está identificado como estudo.',
    'Os dados são fictícios ou autorizados.',
    'A ferramenta e os passos são descritos corretamente.',
    'O resultado pode ser aberto ou explicado.',
    'As limitações e melhorias futuras aparecem.',
  ],
  summary: [
    'Listar uma ferramenta é diferente de demonstrar o que você faz com ela.',
    'Projetos de estudo são válidos quando são identificados com honestidade.',
    'Uma boa evidência mostra ação, ferramenta, problema, entrega e resultado.',
    'O miniportfólio registra como você pensou, executou e conferiu.',
  ],
};

const CAP_3: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Capítulo 3 — LinkedIn e presença profissional',
    pages: '12–13',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Monte uma vitrine profissional clara, verdadeira e coerente com o tipo de oportunidade que procura.',
    },
    { kind: 'heading', text: 'LinkedIn como vitrine profissional' },
    {
      kind: 'paragraph',
      text: 'O LinkedIn reúne identidade, experiências, formação, competências, projetos e publicações. O perfil não cria uma competência que ainda não existe. Ele ajuda outras pessoas a entender o que você já faz, o que está desenvolvendo e qual direção profissional procura.',
    },
    {
      kind: 'analogy',
      text: 'Uma vitrine organizada facilita encontrar o produto certo. Mas a vitrine precisa corresponder ao que existe dentro da loja.',
    },
    { kind: 'heading', text: 'Os blocos essenciais do perfil' },
    {
      kind: 'table',
      headers: ['Bloco', 'O que deve comunicar', 'Cuidado'],
      rows: [
        ['Título profissional', 'Área, competências e foco', 'Evitar lista confusa de palavras'],
        ['Sobre', 'Resumo, prática e objetivo', 'Não inventar experiência'],
        ['Experiência', 'Atividades e resultados reais', 'Não expor informação interna'],
        ['Projetos', 'Entregas de estudo ou reais', 'Identificar projetos fictícios'],
        ['Competências', 'Conhecimentos coerentes', 'Adicionar apenas o que consegue sustentar'],
        ['Destaques', 'Portfólio ou publicação', 'Revisar privacidade e direitos'],
      ],
    },
    { kind: 'heading', text: 'Um título profissional fácil de entender' },
    {
      kind: 'paragraph',
      text: "Exemplo para uma personagem: 'Assistente Administrativo em formação | Word, Excel e IA | Organização de documentos e controles'. Use termos que combinam com seu conhecimento e com as oportunidades desejadas. Palavra-chave ajuda a busca, mas não substitui proficiência.",
    },
    {
      kind: 'template',
      label: 'Modelo de título',
      text: '[Área ou função] | [2 ou 3 competências] | [problema ou tipo de entrega]',
    },
    { kind: 'heading', text: 'Uma seção Sobre em cinco partes' },
    {
      kind: 'template',
      label: 'Modelo da seção Sobre',
      text: 'Estou desenvolvendo conhecimentos em [área]. Já pratiquei [tarefas ou projetos verdadeiros]. Tenho interesse em [tipo de oportunidade]. Gosto de contribuir com [qualidades demonstráveis]. Atualmente estou evoluindo em [próximo passo].',
    },
    { kind: 'heading', text: 'Experiências, cursos e projetos' },
    {
      kind: 'paragraph',
      text: 'Descreva experiências reais com verbos de ação e exemplos. Cursos devem aparecer com nome e instituição corretos. Projetos de estudo podem demonstrar iniciativa, desde que estejam claramente identificados como projetos.',
    },
    {
      kind: 'paragraph',
      text: 'A área de Destaques pode reunir um PDF, uma apresentação, um link ou uma publicação. Antes de publicar, remova nomes, dados, logotipos, números internos e qualquer material que você não tenha direito de divulgar.',
    },
    { kind: 'heading', text: 'Visibilidade, Open to Work e privacidade' },
    {
      kind: 'paragraph',
      text: 'O recurso Open to Work permite indicar interesse em oportunidades e escolher quem pode ver essa informação. Revise cargos, localizações e visibilidade antes de ativar.',
    },
    {
      kind: 'warning',
      text: 'Não publique endereço completo, documentos, senhas, rotina detalhada, dados familiares ou informações internas. Leitores mais jovens devem respeitar as regras de idade do serviço e contar com orientação responsável.',
    },
  ],
  checklist: [
    'A primeira frase deixa a área clara.',
    'As práticas e projetos podem ser comprovados.',
    'O texto mostra uma direção profissional.',
    'A linguagem é simples e natural.',
    'Não há exagero, promessa ou experiência inventada.',
  ],
  summary: [
    'O perfil deve explicar quem você é, o que sabe fazer e o que está buscando.',
    'Palavras-chave ajudam a ser encontrado, mas não substituem domínio real.',
    'Projetos de estudo podem aparecer como projetos, nunca como empregos inventados.',
    'Privacidade e veracidade vêm antes da visibilidade.',
  ],
};

const CAP_4: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Capítulo 4 — Networking online e candidaturas',
    pages: '14–15',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Crie relações profissionais com respeito e organize a busca por oportunidades sem transformar contato em spam.',
    },
    { kind: 'heading', text: 'Networking é relacionamento, não coleção' },
    {
      kind: 'paragraph',
      text: 'Uma rede profissional é formada por pessoas que conhecem seu trabalho, seus interesses ou sua forma de participar. O objetivo não é ter o maior número possível de conexões. É construir relações que façam sentido ao longo do tempo.',
    },
    {
      kind: 'analogy',
      text: 'Networking se parece mais com cuidar de uma pequena horta do que distribuir panfletos: exige atenção, tempo, troca e continuidade.',
    },
    { kind: 'heading', text: 'O caminho em três passos' },
    {
      kind: 'steps',
      items: [
        'Observar: conheça o trabalho, os interesses e o contexto da pessoa.',
        'Interagir: faça um comentário específico, compartilhe um aprendizado ou formule uma pergunta honesta.',
        'Conectar: envie um convite curto explicando o ponto em comum.',
      ],
    },
    {
      kind: 'table',
      headers: ['Evite', 'Prefira'],
      rows: [
        ['Olá, tem vaga?', 'Vi seu conteúdo sobre X e aprendi Y.'],
        ['Pode me indicar?', 'Qual competência mais ajudou no início?'],
        ['Mensagem copiada para todos', 'Mensagem curta com contexto real'],
        ['Cobrar resposta', 'Respeitar o tempo e o silêncio'],
      ],
    },
    { kind: 'heading', text: 'Modelos de mensagem' },
    {
      kind: 'template',
      label: 'Conexão',
      text: 'Olá, [nome]. Vi seu conteúdo sobre [tema específico]. Estou estudando [assunto] e o ponto sobre [aprendizado real] me ajudou. Gostaria de acompanhar seus próximos conteúdos.',
    },
    {
      kind: 'template',
      label: 'Orientação',
      text: 'Olá, [nome]. Estou me preparando para oportunidades em [área]. Vi que você trabalha com [contexto real]. Se puder, gostaria de saber qual competência mais ajudou no início. Entendo se não puder responder.',
    },
    {
      kind: 'warning',
      text: 'Não envie anexos, links ou pedidos pessoais sem necessidade. Nunca pressione alguém por resposta, indicação ou oportunidade.',
    },
    { kind: 'heading', text: 'Como participar sem criar conteúdo longo' },
    {
      kind: 'list',
      items: [
        'Comente uma ideia específica e diga o que aprendeu.',
        'Faça uma pergunta que demonstra leitura do conteúdo.',
        'Compartilhe uma pequena prática e o resultado.',
        'Publique um antes e depois de projeto de estudo sem dados sensíveis.',
      ],
    },
    { kind: 'heading', text: 'Candidaturas também precisam de organização' },
    {
      kind: 'paragraph',
      text: 'Registre as oportunidades para não perder prazos e para descobrir padrões. Uma planilha simples permite comparar requisitos, evidências, lacunas e próximos passos.',
    },
    {
      kind: 'table',
      headers: ['Campo', 'Exemplo'],
      rows: [
        ['Vaga e empresa', 'Assistente Administrativo - Empresa Exemplo'],
        ['Data e link', '01/08/2026 - endereço da vaga'],
        ['Status', 'Salva, enviada, entrevista ou encerrada'],
        ['Evidências', 'Relatório no Word e controle no Excel'],
        ['Lacunas', 'Tabela Dinâmica e apresentação oral'],
        ['Próximo passo', 'Praticar um exercício e revisar em 7 dias'],
      ],
    },
  ],
  checklist: [
    'A empresa, a vaga e o contato existem em canais oficiais.',
    'O domínio do e-mail combina com a organização.',
    'Não há cobrança para participar do processo.',
    'Ninguém pediu senha ou documento sensível logo no início.',
    'Não existe promessa de emprego garantido.',
  ],
  summary: [
    'Networking é relacionamento, não pedido imediato de emprego.',
    'Candidaturas organizadas ajudam a descobrir padrões e lacunas.',
    'Vagas falsas costumam usar urgência, promessa e pedidos de dados ou dinheiro.',
  ],
};

const CAP_5: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Capítulo 5 — Inteligência artificial no dia a dia profissional',
    pages: '17–19',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Use IA para aprender, planejar, rascunhar e revisar, mantendo dados, fatos e decisões sob controle humano.',
    },
    { kind: 'heading', text: 'A IA é uma assistente, não uma substituta da sua responsabilidade' },
    {
      kind: 'paragraph',
      text: 'A inteligência artificial pode organizar ideias e produzir uma primeira versão em segundos. Ela também pode interpretar algo errado, omitir uma informação ou criar uma resposta convincente sem base suficiente. A pessoa precisa definir, conferir, ajustar e aprovar.',
    },
    {
      kind: 'paragraph',
      text: 'O Work Trend Index 2026, da Microsoft, destaca controle de qualidade das saídas de IA e pensamento crítico entre as capacidades humanas que ganham importância em ambientes com mais IA.',
    },
    {
      kind: 'analogy',
      text: 'Pense em uma pessoa muito rápida que ajuda a rascunhar, mas que não conhece automaticamente sua empresa, suas regras e seus fatos. Ela precisa de contexto e supervisão.',
    },
    { kind: 'heading', text: 'Quatro papéis úteis da IA' },
    {
      kind: 'table',
      headers: ['Papel', 'Como ajuda', 'Você continua fazendo'],
      rows: [
        ['Planejadora', 'Divide objetivo em etapas', 'Escolhe prioridade e prazo'],
        ['Rascunhadora', 'Prepara primeira versão', 'Confere fatos e tom'],
        ['Explicadora', 'Adapta linguagem e exemplos', 'Valida significado'],
        ['Revisora', 'Aponta lacunas e inconsistências', 'Decide o que aceitar'],
      ],
    },
    { kind: 'heading', text: 'O fluxo seguro de trabalho' },
    {
      kind: 'keyIdea',
      text: 'IA pode preparar. A pessoa responsável precisa verificar e aprovar.',
    },
    {
      kind: 'steps',
      items: [
        'Defina uma tarefa pequena e verificável.',
        'Use apenas contexto e dados permitidos.',
        'Diga objetivo, material, formato e limites.',
        'Leia a resposta procurando lacunas, erros e exageros.',
        'Confira fatos, datas, nomes, cálculos e fontes.',
        'Finalize no Word, Excel, PowerPoint ou sistema adequado.',
        'Peça aprovação humana antes de enviar, publicar ou decidir.',
      ],
    },
    { kind: 'heading', text: 'Casos de uso conectados aos módulos anteriores' },
    {
      kind: 'table',
      headers: ['Tarefa', 'IA pode ajudar', 'Onde finalizar'],
      rows: [
        [
          'Organizar trabalho',
          'Checklist e nomes de arquivos',
          'Windows e armazenamento autorizado',
        ],
        ['Escrever documento', 'Rascunho e revisão', 'Word'],
        ['Analisar dados', 'Perguntas e fórmulas sugeridas', 'Excel com conferência'],
        ['Apresentar ideia', 'Roteiro e títulos', 'PowerPoint'],
        [
          'Preparar carreira',
          'Comparar vaga e simular entrevista',
          'Currículo, LinkedIn e registro',
        ],
      ],
    },
    { kind: 'heading', text: 'Prompts responsáveis para praticar' },
    {
      kind: 'template',
      label: 'Comparar uma vaga com suas competências',
      text: 'Analise a descrição de vaga abaixo e compare apenas com minha lista de competências verdadeiras. Separe em: correspondências, lacunas e perguntas que preciso responder. Não invente experiência. Para cada lacuna, sugira uma prática pequena. Vaga: [cole o texto público]. Competências verdadeiras: [liste].',
    },
    {
      kind: 'template',
      label: 'Simular entrevista',
      text: 'Faça uma pergunta por vez para uma vaga de [função]. Depois da minha resposta, dê feedback sobre clareza, exemplo e lacunas. Não invente fatos por mim.',
    },
    {
      kind: 'template',
      label: 'Revisar um texto de perfil',
      text: 'Revise este texto para deixá-lo claro e natural. Preserve todos os fatos e marque qualquer frase que pareça exagerada ou sem evidência.',
    },
    { kind: 'heading', text: 'Privacidade e limites' },
    {
      kind: 'warning',
      text: 'Não envie senhas, documentos, dados de clientes, informações de funcionários, contratos, estratégias ou conteúdo interno sem autorização e ambiente aprovado.',
    },
    { kind: 'heading', text: 'Escolha seu próximo passo' },
    {
      kind: 'table',
      headers: ['Se sua maior dificuldade é', 'Próximo módulo'],
      rows: [
        ['Usar computador, organizar e proteger arquivos', 'Módulo 1 — Computação e Windows'],
        ['Criar currículos, relatórios e documentos', 'Módulo 2 — Microsoft Word'],
        ['Controlar, calcular e analisar dados', 'Módulo 3 — Microsoft Excel'],
        ['Apresentar ideias e resultados', 'Módulo 4 — Microsoft PowerPoint'],
        ['Usar IA em processos com profundidade', 'Módulo 5 — IA para Administração'],
      ],
    },
  ],
  checklist: [
    'A IA usou apenas as informações fornecidas.',
    'Nenhuma lacuna foi transformada em experiência.',
    'As correspondências podem ser demonstradas.',
    'As práticas sugeridas são pequenas e seguras.',
  ],
  summary: [
    'IA acelera partes do trabalho; a pessoa continua responsável pelo resultado.',
    'Um bom fluxo inclui contexto permitido, verificação e ferramenta final correta.',
    'A IA pode ajudar a estudar vagas e entrevistas sem inventar experiência.',
    'O maior diferencial é unir velocidade, julgamento e qualidade de entrega.',
  ],
};

// ---------------------------------------------------------------------------
// Rubricas — extraídas da tabela "Critérios de avaliação" (páginas 21–22)
// e das listas "Conferir:" de cada capítulo.
// ---------------------------------------------------------------------------

/** Falhas críticas do projeto final, aplicadas a todo o módulo (página 22). */
const FALHAS_CRITICAS = [
  'Apresentar experiência, empresa, cliente, cargo ou resultado inventado como real.',
  'Expor dado sensível: documento, senha, endereço completo, dado de cliente ou informação interna.',
  'Descrever envio de mensagens em massa ou cobrança de resposta de alguém.',
  'Usar resposta de IA sem revisão e sem conferir os fatos.',
  'Prometer ou sugerir garantia de emprego, salário ou aprovação.',
];

const RUBRICA_MAPA: ActivityRubric = {
  passingScore: 70,
  minWords: 80,
  criticalFailures: FALHAS_CRITICAS,
  criteria: [
    {
      id: 'competencias-escolhidas',
      title: 'Cinco competências escolhidas',
      weight: 30,
      whatToObserve:
        'O relato cita cinco competências da trilha, com nomes concretos de ferramentas ou tarefas.',
    },
    {
      id: 'classificacao-honesta',
      title: 'Classificação honesta do domínio',
      weight: 30,
      whatToObserve:
        "Cada competência aparece classificada como 'faço sozinho', 'faço com ajuda' ou 'ainda vou aprender', sem exagero.",
    },
    {
      id: 'prioridade-unica',
      title: 'Uma prioridade da semana',
      weight: 20,
      whatToObserve: 'Uma única competência é escolhida para praticar, com justificativa.',
    },
    {
      id: 'entrega-comprovante',
      title: 'Entrega que comprova a prática',
      weight: 20,
      whatToObserve:
        'Há uma entrega simples e verificável definida, com o degrau de proficiência alcançado.',
    },
  ],
};

const RUBRICA_PORTFOLIO: ActivityRubric = {
  passingScore: 70,
  minWords: 120,
  criticalFailures: FALHAS_CRITICAS,
  criteria: [
    {
      id: 'identificado-estudo',
      title: 'Projeto identificado como estudo',
      weight: 25,
      whatToObserve:
        'O relato deixa explícito que se trata de exercício com dados fictícios ou autorizados.',
    },
    {
      id: 'estrutura-miniportfolio',
      title: 'Estrutura do miniportfólio',
      weight: 30,
      whatToObserve:
        'Aparecem situação, objetivo, ferramentas, processo, entrega, verificação e aprendizado.',
    },
    {
      id: 'formula-evidencia',
      title: 'Descrição na fórmula de evidência',
      weight: 25,
      whatToObserve:
        'A descrição segue ação + ferramenta + problema + entrega + resultado verificável.',
    },
    {
      id: 'verificacao',
      title: 'Verificação declarada',
      weight: 20,
      whatToObserve: 'O relato diz como o conteúdo, os números ou a apresentação foram conferidos.',
    },
  ],
};

const RUBRICA_PERFIL: ActivityRubric = {
  passingScore: 70,
  minWords: 120,
  criticalFailures: FALHAS_CRITICAS,
  criteria: [
    {
      id: 'titulo',
      title: 'Título profissional no modelo',
      weight: 20,
      whatToObserve:
        'Segue [área ou função] | [2 ou 3 competências] | [problema ou tipo de entrega].',
    },
    {
      id: 'sobre-cinco-partes',
      title: 'Seção Sobre em cinco partes',
      weight: 30,
      whatToObserve:
        'Traz área, práticas verdadeiras, interesse, contribuição demonstrável e próximo passo.',
    },
    {
      id: 'competencias-sustentaveis',
      title: 'Competências sustentáveis',
      weight: 25,
      whatToObserve: 'Cinco competências que a personagem consegue demonstrar, sem exagero.',
    },
    {
      id: 'projetos-marcados',
      title: 'Projetos marcados como estudo',
      weight: 25,
      whatToObserve:
        'Dois projetos identificados como estudo e a marcação do que precisaria de comprovação.',
    },
  ],
};

const RUBRICA_NETWORKING: ActivityRubric = {
  passingScore: 70,
  minWords: 100,
  criticalFailures: FALHAS_CRITICAS,
  criteria: [
    {
      id: 'comentario-especifico',
      title: 'Comentário específico',
      weight: 30,
      whatToObserve:
        'O comentário mostra leitura real do conteúdo, com aprendizado e uma pergunta.',
    },
    {
      id: 'mensagem-curta',
      title: 'Mensagem de conexão com contexto',
      weight: 30,
      whatToObserve: 'Até quatro linhas, com ponto em comum verdadeiro e tom respeitoso.',
    },
    {
      id: 'sem-pedido',
      title: 'Sem pedido de vaga ou indicação',
      weight: 20,
      whatToObserve: 'Nenhuma cobrança, pedido de vaga, indicação ou pressão por resposta.',
    },
    {
      id: 'controle-candidaturas',
      title: 'Controle de candidaturas',
      weight: 20,
      whatToObserve: 'Há registro com vaga, data, status, evidência, lacuna e próximo passo.',
    },
  ],
};

const RUBRICA_IA: ActivityRubric = {
  passingScore: 70,
  minWords: 120,
  criticalFailures: FALHAS_CRITICAS,
  criteria: [
    {
      id: 'prompt-registrado',
      title: 'Prompt registrado',
      weight: 20,
      whatToObserve: 'O relato mostra o que foi pedido à IA, com objetivo, contexto e limites.',
    },
    {
      id: 'aceite-e-recusa',
      title: 'Uma sugestão aceita e outra recusada',
      weight: 30,
      whatToObserve:
        'Exatamente uma sugestão aceita e uma recusada, cada uma com o motivo da decisão.',
    },
    {
      id: 'conferencia',
      title: 'Conferência dos fatos',
      weight: 30,
      whatToObserve:
        'O relato descreve como fatos, números ou nomes da resposta foram verificados.',
    },
    {
      id: 'ferramenta-final',
      title: 'Finalização na ferramenta correta',
      weight: 20,
      whatToObserve: 'A mudança foi aplicada na ferramenta adequada e o resultado foi conferido.',
    },
  ],
};

/**
 * Rubrica do projeto final.
 *
 * Critérios, pesos e nota de corte transcritos da tabela "Critérios de
 * avaliação" do e-book (página 21). As falhas críticas são as listadas na
 * página 22.
 */
const RUBRICA_PROJETO_FINAL: ActivityRubric = {
  passingScore: 70,
  minWords: 250,
  criticalFailures: FALHAS_CRITICAS,
  criteria: [
    {
      id: 'verdade-e-clareza',
      title: 'Verdade e clareza',
      weight: 25,
      whatToObserve:
        'Nenhuma experiência inventada; tudo o que é estudo aparece identificado como estudo.',
    },
    {
      id: 'competencia-demonstrada',
      title: 'Competência demonstrada',
      weight: 20,
      whatToObserve: 'A entrega é explicada e verificável, com processo e conferência descritos.',
    },
    {
      id: 'perfil-profissional',
      title: 'Perfil profissional',
      weight: 15,
      whatToObserve: 'Título, seção Sobre e projetos coerentes entre si e com a função desejada.',
    },
    {
      id: 'networking',
      title: 'Networking',
      weight: 15,
      whatToObserve: 'Mensagens específicas e respeitosas, sem pedido de vaga ou cobrança.',
    },
    {
      id: 'ia-responsavel',
      title: 'IA responsável',
      weight: 15,
      whatToObserve:
        'Prompt, revisão e decisão registrados, com pelo menos uma correção feita por você.',
    },
    {
      id: 'plano-de-evolucao',
      title: 'Plano de evolução',
      weight: 10,
      whatToObserve: 'Próximos passos realistas, com foco e entrega definidos para cada semana.',
    },
  ],
};

const GUIA_RAPIDO: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Guia de consulta rápida e Referências oficiais',
    pages: '23–24',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Use esta seção para relembrar os modelos principais. Volte aos capítulos quando precisar entender o raciocínio completo.',
    },
    { kind: 'heading', text: 'Os modelos do módulo' },
    {
      kind: 'template',
      label: 'Fórmula de evidência',
      text: 'Ação + ferramenta + problema + entrega + resultado verificável',
    },
    {
      kind: 'template',
      label: 'Título profissional',
      text: '[Área ou função] | [2 ou 3 competências] | [problema ou tipo de entrega]',
    },
    {
      kind: 'template',
      label: 'Mensagem curta de networking',
      text: 'Olá, [nome]. Vi seu conteúdo sobre [tema]. Estou estudando [assunto] e aprendi [ponto específico]. Gostaria de acompanhar seus próximos conteúdos.',
    },
    {
      kind: 'template',
      label: 'Prompt responsável',
      text: 'Objetivo: [tarefa]. Contexto autorizado: [informações]. Formato: [entrega]. Limites: não inventar dados, marcar lacunas e pedir confirmação antes de qualquer envio.',
    },
    { kind: 'heading', text: 'Qual módulo estudar agora?' },
    {
      kind: 'table',
      headers: ['Objetivo', 'Módulo recomendado'],
      rows: [
        ['Organizar arquivos e usar o computador com segurança', 'Módulo 1'],
        ['Criar currículos, relatórios e documentos', 'Módulo 2'],
        ['Controlar e analisar informações', 'Módulo 3'],
        ['Apresentar projetos e resultados', 'Módulo 4'],
        ['Aplicar IA em processos administrativos', 'Módulo 5'],
      ],
    },
    { kind: 'heading', text: 'Referências oficiais' },
    {
      kind: 'paragraph',
      text: 'O conteúdo foi validado com materiais oficiais do Fórum Econômico Mundial, LinkedIn e Microsoft. Recursos, telas, políticas e disponibilidade podem mudar. Consulte sempre as páginas atuais e as regras da organização.',
    },
    {
      kind: 'list',
      items: [
        'World Economic Forum — Future of Jobs Report 2025',
        'LinkedIn — Crie um bom perfil, Sua página de perfil e Edite a seção Sobre',
        'LinkedIn — Construa sua rede profissional, Graus de conexão e Open to Work',
        'Microsoft — Work Trend Index 2026',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Os endereços completos estão na última página do e-book, em "Materiais de apoio".',
    },
  ],
  checklist: [
    'Informações verdadeiras e demonstráveis.',
    'Projetos de estudo identificados.',
    'Dados pessoais e internos protegidos.',
    'Perfil, currículo e portfólio coerentes.',
    'Networking com contexto e respeito.',
    'Respostas de IA conferidas.',
    'Arquivos finais abertos e revisados.',
    'Próximo passo pequeno e realista.',
  ],
};

/** Questionário curto de fixação, ao fim de uma parte. */
const FIXACAO = (titulo: string, questions: SeedQuestion[]): SeedLesson => ({
  title: titulo,
  type: LessonType.QUIZ,
  estimatedMinutes: 8,
  passingScore: 70,
  summary: 'Confira o que ficou desta parte antes de avançar. Tentativas ilimitadas.',
  questions,
});

const QUESTIONARIOS: Record<string, SeedLesson> = {
  'Parte 1 — Conhecimento que vira valor': FIXACAO('Fixação — Conhecimento que vira valor', [
    QUESTAO(
      'O que é letramento tecnológico?',
      'É usar ferramentas digitais com compreensão, segurança e senso crítico — não decorar menus.',
      [
        ['Usar ferramentas digitais com compreensão, segurança e senso crítico.', true],
        ['Decorar todos os menus dos programas.', false],
        ['Trabalhar na área de tecnologia.', false],
        ['Ter o computador mais moderno.', false],
      ],
    ),
    QUESTAO(
      'Você concluiu uma tarefa com apoio do material, mas ainda depende de copiar cada passo. Em que degrau está?',
      'Executar é concluir a tarefa com apoio; repetir é fazer de novo com consistência, sem copiar passo a passo.',
      [
        ['Executar.', true],
        ['Repetir.', false],
        ['Explicar.', false],
        ['Melhorar.', false],
      ],
    ),
    QUESTAO(
      'Qual frase é uma evidência profissional, e não apenas uma informação?',
      'A evidência mostra ação, ferramenta, problema, entrega e como foi conferida.',
      [
        [
          'Criei uma planilha de estudo de despesas, usei filtros e conferi os totais por dois métodos.',
          true,
        ],
        ['Sei Excel.', false],
        ['Tenho conhecimento de informática.', false],
        ['Uso IA no dia a dia.', false],
      ],
    ),
    QUESTAO(
      'Pode usar um projeto fictício no portfólio?',
      'Pode, desde que identificado como exercício ou estudo. Nunca apresente como experiência real.',
      [
        ['Sim, desde que identificado como projeto de estudo.', true],
        ['Não, projetos fictícios nunca podem aparecer.', false],
        ['Sim, e pode ser apresentado como experiência de trabalho.', false],
        ['Só se a empresa citada existir de verdade.', false],
      ],
    ),
    QUESTAO(
      'Qual destes itens este material pode oferecer?',
      'O e-book é explícito: melhora preparo, evidências e clareza; não garante contratação nem salário.',
      [
        ['Preparo, evidências e clareza para comunicar competências.', true],
        ['Garantia de contratação.', false],
        ['Salário específico.', false],
        ['Aprovação em processo seletivo.', false],
      ],
    ),
    QUESTAO(
      'O que a estrutura do miniportfólio registra, além da entrega?',
      'Ela registra situação, objetivo, ferramentas, processo, entrega, verificação e aprendizado.',
      [
        ['Como você pensou, executou e conferiu.', true],
        ['Apenas o arquivo final.', false],
        ['O tempo gasto em cada tarefa.', false],
        ['A nota atribuída pelo professor.', false],
      ],
    ),
  ]),

  'Parte 2 — Visibilidade e relacionamentos': FIXACAO('Fixação — Visibilidade e relacionamentos', [
    QUESTAO(
      'Qual é o modelo de título profissional apresentado no capítulo?',
      'O modelo é: [área ou função] | [2 ou 3 competências] | [problema ou tipo de entrega].',
      [
        ['Área ou função | competências | problema ou tipo de entrega.', true],
        ['Nome completo | cidade | telefone.', false],
        ['Uma lista com todas as ferramentas que você já viu.', false],
        ['Uma frase motivacional.', false],
      ],
    ),
    QUESTAO(
      'Antes de publicar um arquivo na área de Destaques, o que remover?',
      'Remova nomes, dados, logotipos, números internos e qualquer material que você não tenha direito de divulgar.',
      [
        ['Nomes, dados, logotipos e números internos.', true],
        ['Todas as imagens.', false],
        ['As datas dos projetos.', false],
        ['A descrição do processo.', false],
      ],
    ),
    QUESTAO(
      'Qual mensagem de conexão segue a orientação do capítulo?',
      'Prefira contexto real e específico, sem pedido imediato de vaga ou indicação.',
      [
        [
          'Vi seu conteúdo sobre X e o ponto sobre Y me ajudou. Gostaria de acompanhar seus próximos conteúdos.',
          true,
        ],
        ['Olá, tem vaga na sua empresa?', false],
        ['Pode me indicar para alguma oportunidade?', false],
        ['Preciso de uma resposta ainda hoje.', false],
      ],
    ),
    QUESTAO(
      'O que caracteriza networking, segundo o capítulo?',
      'Networking é relacionamento construído com tempo e troca, não coleção de conexões.',
      [
        ['Construir relações que fazem sentido ao longo do tempo.', true],
        ['Ter o maior número possível de conexões.', false],
        ['Enviar a mesma mensagem para muitas pessoas.', false],
        ['Pedir indicação logo no primeiro contato.', false],
      ],
    ),
    QUESTAO(
      'Qual destes é sinal de uma vaga suspeita?',
      'Cobrança para participar do processo é um dos sinais listados no capítulo.',
      [
        ['Existe cobrança para participar do processo seletivo.', true],
        ['A vaga pede experiência prévia.', false],
        ['A empresa tem página oficial.', false],
        ['O processo tem várias etapas.', false],
      ],
    ),
    QUESTAO(
      'Para que serve o controle de candidaturas?',
      'Ele evita perder prazos e ajuda a descobrir padrões, lacunas e próximos passos.',
      [
        ['Não perder prazos e descobrir padrões e lacunas.', true],
        ['Aumentar o número de currículos enviados por dia.', false],
        ['Comparar salários entre empresas.', false],
        ['Guardar os dados pessoais dos recrutadores.', false],
      ],
    ),
  ]),

  'Parte 3 — Trabalho ampliado por IA': FIXACAO('Fixação — Trabalho ampliado por IA', [
    QUESTAO(
      'Qual é a regra de ouro do fluxo seguro de trabalho com IA?',
      'A IA pode preparar; a pessoa responsável precisa verificar e aprovar.',
      [
        ['A IA prepara; a pessoa verifica e aprova.', true],
        ['A IA decide e a pessoa executa.', false],
        ['A pessoa prepara e a IA aprova.', false],
        ['A IA substitui a revisão quando o texto está bom.', false],
      ],
    ),
    QUESTAO(
      'Qual destes papéis da IA está descrito no capítulo?',
      'Planejadora, rascunhadora, explicadora e revisora são os quatro papéis listados.',
      [
        ['Revisora: aponta lacunas e inconsistências, e você decide o que aceitar.', true],
        ['Decisora: escolhe a prioridade por você.', false],
        ['Testemunha: confirma sua experiência profissional.', false],
        ['Auditora: garante que os dados estão corretos.', false],
      ],
    ),
    QUESTAO(
      'O que nunca deve ser enviado a uma ferramenta de IA?',
      'Senhas, documentos, dados de clientes e conteúdo interno exigem autorização e ambiente aprovado.',
      [
        ['Senhas, dados de clientes e conteúdo interno sem autorização.', true],
        ['Um texto público de descrição de vaga.', false],
        ['Sua própria lista de competências verdadeiras.', false],
        ['Um rascunho de e-mail sem dados sensíveis.', false],
      ],
    ),
    QUESTAO(
      'Ao comparar uma vaga com suas competências usando IA, o que conferir na resposta?',
      'Confira se a IA usou só as informações fornecidas e não transformou lacuna em experiência.',
      [
        ['Se nenhuma lacuna virou experiência inventada.', true],
        ['Se a resposta ficou com o tamanho certo.', false],
        ['Se o texto está em linguagem formal.', false],
        ['Se a IA sugeriu mais de dez práticas.', false],
      ],
    ),
    QUESTAO(
      'Você quer aprender a controlar e analisar dados. Qual módulo o e-book indica?',
      'A tabela de próximos passos indica o Módulo 3 — Microsoft Excel para controlar, calcular e analisar dados.',
      [
        ['Módulo 3 — Microsoft Excel.', true],
        ['Módulo 1 — Computação e Windows.', false],
        ['Módulo 2 — Microsoft Word.', false],
        ['Módulo 4 — Microsoft PowerPoint.', false],
      ],
    ),
    QUESTAO(
      'Onde a mudança sugerida pela IA deve ser finalizada?',
      'O fluxo pede finalizar no Word, Excel, PowerPoint ou sistema adequado, e conferir o resultado.',
      [
        ['Na ferramenta adequada, conferindo o resultado.', true],
        ['Na própria conversa com a IA.', false],
        ['Em um bloco de notas, para não perder.', false],
        ['Diretamente no e-mail para o destinatário.', false],
      ],
    ),
  ]),
};

// ---------------------------------------------------------------------------
// Seções
// ---------------------------------------------------------------------------

export const FREE_MODULE_SECTIONS: SeedSection[] = [
  {
    title: 'Parte 1 — Conhecimento que vira valor',
    summary:
      'Compreenda o mercado, avalie seu domínio e transforme aprendizado em evidências. ' +
      'Ao concluir esta parte: reconhecer o papel da tecnologia em diferentes profissões, ' +
      'distinguir conhecimento inicial de proficiência e criar uma primeira evidência profissional verdadeira.',
    lessons: [
      {
        title: 'Capítulo 1 — Tecnologia e o mercado de trabalho',
        type: LessonType.RICH_TEXT,
        estimatedMinutes: 20,
        summary:
          'Entenda por que conhecimentos digitais ajudam em muitas profissões e como eles se combinam com habilidades humanas.',
        content: CAP_1,
      },
      {
        title: 'Capítulo 2 — Da habilidade à evidência profissional',
        type: LessonType.RICH_TEXT,
        estimatedMinutes: 20,
        summary:
          'Transforme estudo e prática em entregas que outras pessoas conseguem compreender e verificar.',
        content: CAP_2,
      },
      {
        title: 'Prática — Mapa de habilidades e primeira evidência',
        type: LessonType.PRACTICAL_ACTIVITY,
        estimatedMinutes: 30,
        summary: 'Monte seu mapa de competências e defina a entrega que vai comprovar sua prática.',
        activityInstructions:
          'Escolha cinco competências da trilha. Marque cada uma como "faço sozinho", "faço com ajuda" ou ' +
          '"ainda vou aprender". Escolha uma única competência para praticar nesta semana e defina uma ' +
          'entrega simples que comprove a prática. Diga também em qual dos cinco degraus da proficiência ' +
          'você está nessa competência e qual evidência sustenta sua resposta.',
        rubric: RUBRICA_MAPA,
        rubricReference: {
          module: EBOOK,
          chapter: 'Capítulo 1 — Sua missão / Capítulo 2 — Estrutura de um miniportfólio',
          pages: '7–10',
        },
      },
      {
        title: 'Prática — Miniportfólio de uma entrega',
        type: LessonType.PRACTICAL_ACTIVITY,
        estimatedMinutes: 40,
        summary: 'Produza uma entrega de estudo e registre-a com a estrutura do miniportfólio.',
        activityInstructions:
          'Escolha uma tarefa de um dos módulos e crie uma entrega curta usando dados fictícios. Registre ' +
          'situação, objetivo, ferramentas, processo, entrega, verificação e aprendizado. Depois escreva ' +
          'três linhas de descrição usando a fórmula ação + ferramenta + problema + entrega + resultado ' +
          'verificável. Identifique o trabalho como projeto de estudo.',
        rubric: RUBRICA_PORTFOLIO,
        rubricReference: {
          module: EBOOK,
          chapter: 'Capítulo 2 — Sua missão e Estrutura de um miniportfólio',
          pages: '10',
        },
      },
      QUESTIONARIOS['Parte 1 — Conhecimento que vira valor'],
    ],
  },
  {
    title: 'Parte 2 — Visibilidade e relacionamentos',
    summary:
      'Apresente seus conhecimentos com clareza e participe de redes profissionais com respeito. ' +
      'Ao concluir esta parte: estruturar um perfil básico no LinkedIn, escrever mensagens de ' +
      'networking com contexto e organizar candidaturas protegendo-se de abordagens suspeitas.',
    lessons: [
      {
        title: 'Capítulo 3 — LinkedIn e presença profissional',
        type: LessonType.RICH_TEXT,
        estimatedMinutes: 20,
        summary:
          'Monte uma vitrine profissional clara, verdadeira e coerente com o tipo de oportunidade que procura.',
        content: CAP_3,
      },
      {
        title: 'Prática — Título e seção Sobre',
        type: LessonType.PRACTICAL_ACTIVITY,
        estimatedMinutes: 30,
        summary: 'Escreva o perfil de uma personagem iniciante usando os modelos do capítulo.',
        activityInstructions:
          'Crie um título profissional para uma personagem iniciante usando o modelo do capítulo. Escreva ' +
          'a seção Sobre com as cinco partes. Liste cinco competências que a personagem consegue ' +
          'demonstrar e adicione dois projetos identificados como estudo. Ao final, marque cada afirmação ' +
          'que precisaria de comprovação antes de ser usada em um perfil real.',
        rubric: RUBRICA_PERFIL,
        rubricReference: {
          module: EBOOK,
          chapter: 'Capítulo 3 — Sua missão e listas Conferir',
          pages: '12–13',
        },
      },
      {
        title: 'Capítulo 4 — Networking online e candidaturas',
        type: LessonType.RICH_TEXT,
        estimatedMinutes: 20,
        summary:
          'Crie relações profissionais com respeito e organize a busca por oportunidades sem transformar contato em spam.',
        content: CAP_4,
      },
      {
        title: 'Prática — Mensagens e controle de candidaturas',
        type: LessonType.PRACTICAL_ACTIVITY,
        estimatedMinutes: 30,
        summary: 'Escreva um comentário e uma mensagem de conexão, e monte seu controle de vagas.',
        activityInstructions:
          'Escolha uma publicação profissional pública. Escreva um comentário que mostre um aprendizado e ' +
          'faça uma pergunta. Crie uma mensagem de conexão com até quatro linhas, retirando qualquer ' +
          'pedido de vaga ou indicação. Por fim, monte um controle com pelo menos três oportunidades, ' +
          'registrando vaga, empresa, data, status, evidência, lacuna e próximo passo.',
        rubric: RUBRICA_NETWORKING,
        rubricReference: {
          module: EBOOK,
          chapter: 'Capítulo 4 — Sua missão e Candidaturas',
          pages: '14–15',
        },
      },
      QUESTIONARIOS['Parte 2 — Visibilidade e relacionamentos'],
    ],
  },
  {
    title: 'Parte 3 — Trabalho ampliado por IA',
    summary:
      'Use inteligência artificial para ampliar capacidade sem abandonar julgamento, privacidade e revisão. ' +
      'Ao concluir esta parte: escolher usos simples e seguros de IA, conferir respostas antes de aplicar ' +
      'ou publicar e selecionar o próximo passo da trilha.',
    lessons: [
      {
        title: 'Capítulo 5 — Inteligência artificial no dia a dia profissional',
        type: LessonType.RICH_TEXT,
        estimatedMinutes: 25,
        summary:
          'Use IA para aprender, planejar, rascunhar e revisar, mantendo dados, fatos e decisões sob controle humano.',
        content: CAP_5,
      },
      {
        title: 'Prática — Uso responsável de IA em um projeto',
        type: LessonType.PRACTICAL_ACTIVITY,
        estimatedMinutes: 30,
        summary: 'Peça melhorias à IA, decida o que aceitar e registre o motivo de cada decisão.',
        activityInstructions:
          'Escolha um projeto fictício dos módulos anteriores e peça à IA três melhorias. Aceite uma ' +
          'sugestão e rejeite outra, registrando o motivo das duas decisões. Finalize a mudança na ' +
          'ferramenta correta e confira o resultado. No relato, escreva o prompt que usou, o que a ' +
          'resposta trouxe de útil, qual erro ou exagero você encontrou e qual foi a decisão final.',
        rubric: RUBRICA_IA,
        rubricReference: {
          module: EBOOK,
          chapter: 'Capítulo 5 — Sua missão e O fluxo seguro de trabalho',
          pages: '17–19',
        },
      },
      QUESTIONARIOS['Parte 3 — Trabalho ampliado por IA'],
    ],
  },
  {
    title: 'Projeto final e conclusão',
    summary:
      'Reúna o que você aprendeu em um plano realista de 30 dias e verifique sua compreensão.',
    lessons: [
      {
        title: 'Projeto final — Plano de 30 dias',
        type: LessonType.PRACTICAL_ACTIVITY,
        estimatedMinutes: 40,
        summary:
          'Transforme conhecimento em uma pequena presença profissional, com entregas semanais verificáveis.',
        activityInstructions:
          'Ana Souza é uma personagem fictícia que deseja iniciar na área administrativa. Trabalhe o caso ' +
          'dela em cinco entregas: (1) mapa de competências, com três prioridades sendo pelo menos uma ' +
          'técnica e uma humana; (2) uma evidência de estudo registrada com situação, objetivo, ferramenta, ' +
          'passos, entrega, verificação e aprendizado; (3) título profissional, seção Sobre em cinco partes, ' +
          'cinco competências e dois projetos de estudo; (4) controle de cinco oportunidades com vaga, ' +
          'empresa, data, status, evidência, lacuna e próximo passo, mais o registro de um uso de IA com ' +
          'prompt, resposta útil, erro encontrado, correção e decisão final; (5) o plano de 30 dias, com ' +
          'foco e entrega de cada semana. Use dados fictícios e identifique todo exercício como estudo.',
        rubric: RUBRICA_PROJETO_FINAL,
        rubricReference: {
          module: EBOOK,
          chapter: 'Projeto final — Critérios de avaliação',
          pages: '20–22',
        },
      },
      {
        title: 'Guia de consulta rápida e referências oficiais',
        type: LessonType.RICH_TEXT,
        estimatedMinutes: 10,
        summary:
          'Use este guia para relembrar os modelos principais e consultar as fontes oficiais.',
        content: GUIA_RAPIDO,
      },
      {
        title: 'Questionário de conclusão',
        type: LessonType.QUIZ,
        estimatedMinutes: 10,
        passingScore: 70,
        questions: [
          {
            statement: 'O que é letramento tecnológico, segundo o módulo?',
            type: QuestionType.SINGLE_CHOICE,
            explanation:
              'Letramento tecnológico é usar ferramentas digitais com compreensão, segurança e senso ' +
              'crítico. Não é decorar todos os menus.',
            options: [
              { text: 'Decorar todos os menus e botões dos programas.', isCorrect: false },
              {
                text: 'Usar ferramentas digitais com compreensão, segurança e senso crítico.',
                isCorrect: true,
              },
              { text: 'Trabalhar exclusivamente na área de tecnologia.', isCorrect: false },
              { text: 'Ter o computador mais moderno possível.', isCorrect: false },
            ],
          },
          {
            statement:
              'Qual afirmação descreve corretamente a diferença entre conhecer uma ferramenta e ter proficiência nela?',
            type: QuestionType.SINGLE_CHOICE,
            explanation:
              'Saber abrir uma ferramenta não é o mesmo que ter proficiência. A evolução acontece com ' +
              'prática, repetição, compreensão e evidência.',
            options: [
              { text: 'São a mesma coisa: abrir o programa já é proficiência.', isCorrect: false },
              {
                text: 'Proficiência aparece com prática, repetição, compreensão e evidência.',
                isCorrect: true,
              },
              { text: 'Proficiência depende apenas de fazer um curso.', isCorrect: false },
              { text: 'Proficiência é medida pelo tempo de uso do computador.', isCorrect: false },
            ],
          },
          {
            statement:
              'Quais cuidados o módulo recomenda ao usar inteligência artificial no trabalho? (marque todas as corretas)',
            type: QuestionType.MULTIPLE_CHOICE,
            explanation:
              'A IA é uma assistente: use-a apenas quando conseguir conferir a resposta e mantenha ' +
              'dados, fatos e decisões sob controle humano.',
            options: [
              {
                text: 'Usar a IA apenas quando você conseguir conferir a resposta.',
                isCorrect: true,
              },
              { text: 'Manter fatos e decisões sob responsabilidade humana.', isCorrect: true },
              {
                text: 'Aceitar qualquer resposta da IA sem revisar, para ganhar tempo.',
                isCorrect: false,
              },
              {
                text: 'Transformar lacunas de experiência em experiência inventada no currículo.',
                isCorrect: false,
              },
            ],
          },
          {
            statement: 'O que este material se propõe a fazer?',
            type: QuestionType.SINGLE_CHOICE,
            explanation:
              'O e-book afirma explicitamente que melhora preparo e clareza, mas não garante emprego, ' +
              'salário, promoção ou aprovação em processo seletivo.',
            options: [
              { text: 'Garantir emprego e promoção após a conclusão.', isCorrect: false },
              { text: 'Melhorar o preparo e a clareza profissional.', isCorrect: true },
              { text: 'Substituir a experiência prática de trabalho.', isCorrect: false },
              { text: 'Garantir aprovação em processos seletivos.', isCorrect: false },
            ],
          },
          QUESTAO(
            'Qual é a fórmula de uma boa descrição de evidência?',
            'Ação + ferramenta + problema + entrega + resultado verificável.',
            [
              ['Ação + ferramenta + problema + entrega + resultado verificável.', true],
              ['Cargo + empresa + tempo de casa.', false],
              ['Curso + carga horária + nota.', false],
              ['Ferramenta + anos de experiência.', false],
            ],
          ),
          QUESTAO(
            'Qual é a primeira etapa do caminho de networking em três passos?',
            'Observar: conhecer o trabalho, os interesses e o contexto da pessoa antes de interagir.',
            [
              ['Observar o trabalho e o contexto da pessoa.', true],
              ['Enviar o convite de conexão.', false],
              ['Pedir uma indicação.', false],
              ['Publicar um artigo longo.', false],
            ],
          ),
          QUESTAO(
            'O que o recurso Open to Work permite?',
            'Indicar interesse em oportunidades e escolher quem pode ver essa informação.',
            [
              ['Indicar interesse em oportunidades e controlar quem vê.', true],
              ['Garantir que recrutadores entrem em contato.', false],
              ['Publicar o currículo automaticamente.', false],
              ['Ocultar seu perfil de outras empresas.', false],
            ],
          ),
          QUESTAO(
            'Na semana 1 do plano de 30 dias, qual é a entrega?',
            'A semana 1 é de diagnóstico: mapa de competências e três prioridades.',
            [
              ['Mapa de competências e três prioridades.', true],
              ['Perfil revisado e duas conexões.', false],
              ['Cinco registros de candidatura.', false],
              ['Uma apresentação de três minutos.', false],
            ],
          ),
          QUESTAO(
            'Qual critério tem o maior peso na avaliação do projeto final?',
            'Verdade e clareza vale 25%, o maior peso da tabela de critérios.',
            [
              ['Verdade e clareza (25%).', true],
              ['Networking (15%).', false],
              ['IA responsável (15%).', false],
              ['Plano de evolução (10%).', false],
            ],
          ),
          QUESTAO(
            'O que caracteriza uma falha crítica no projeto final?',
            'Experiência inventada, dado sensível exposto, spam, IA não revisada ou promessa de emprego.',
            [
              ['Apresentar experiência inventada como real.', true],
              ['Entregar o projeto com uma semana de atraso.', false],
              ['Escolher uma área diferente da sugerida.', false],
              ['Usar menos de cinco competências no mapa.', false],
            ],
          ),
        ],
      },
    ],
  },
];
