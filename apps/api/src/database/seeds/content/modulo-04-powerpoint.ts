import type { SeedLesson } from '../catalog-data';
import type { SectionEnrichment } from './apply-content';
import { ActivityRubric, LessonContent } from './content-types';

/**
 * Módulo 4 — Microsoft PowerPoint para Administração.
 *
 * Conteúdo extraído do e-book oficial (Edição 2026, 29 páginas). A rubrica do
 * projeto final reproduz a tabela "Critérios de avaliação" (página 26) e as
 * falhas críticas listadas nas regras do projeto (página 25).
 */

const EBOOK = 'Módulo 4';

/** Falhas críticas transcritas das regras do projeto final (página 25). */
const FALHAS_CRITICAS = [
  'Dado incorreto que passou sem ser identificado.',
  'Conteúdo sem autorização: imagem, voz, vídeo ou material de terceiros.',
  'Informação privada exposta em slide, nota, comentário ou gravação.',
  'Distribuição da versão errada do arquivo.',
  'Mídia quebrada sem alternativa de contingência preparada.',
];

const CAP_1: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Capítulo 1 — A apresentação como história em cartões',
    pages: '5–6',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Conheça a tela do PowerPoint e monte uma apresentação curta sem medo de errar.',
    },
    { kind: 'heading', text: 'O que o PowerPoint faz' },
    {
      kind: 'paragraph',
      text: 'O PowerPoint ajuda a combinar fala, texto, imagens e dados em uma sequência visual. Ele pode apoiar reuniões, aulas, treinamentos, propostas e relatórios. Você não precisa decorar todos os botões: primeiro pense em quem vai assistir e no que essa pessoa precisa entender.',
    },
    {
      kind: 'analogy',
      text: 'Imagine uma história contada com cartões. Cada slide é um cartão; o apresentador liga um cartão ao seguinte com sua fala.',
    },
    { kind: 'heading', text: 'As peças da tela' },
    {
      kind: 'table',
      headers: ['Nome', 'Explicação fácil', 'Para que serve'],
      rows: [
        ['Apresentação', 'O arquivo inteiro, normalmente .pptx.', 'Guardar todos os slides'],
        ['Slide', 'Um cartão visual dentro do arquivo.', 'Mostrar uma ideia principal'],
        ['Miniaturas', 'Pequenas imagens dos slides, à esquerda.', 'Ver e mudar a ordem'],
        ['Layout', 'Um molde com espaços organizados.', 'Posicionar título, texto e imagem'],
        [
          'Espaço reservado',
          'Área preparada para um tipo de conteúdo.',
          'Inserir sem desmontar o layout',
        ],
        ['Notas', 'Lembretes que apoiam a fala.', 'Ajudar quem apresenta'],
      ],
    },
    { kind: 'heading', text: 'Crie sua primeira apresentação' },
    {
      kind: 'warning',
      text: 'Um slide não é uma página de Word. Se houver duas ideias grandes, separe-as em dois slides.',
    },
    {
      kind: 'steps',
      items: [
        'Abra o PowerPoint e escolha Apresentação em branco.',
        'No primeiro slide, escreva um título curto e um subtítulo.',
        'Use Página Inicial e Novo Slide.',
        'Escolha o layout Título e Conteúdo.',
        'Crie um slide com três prioridades fictícias.',
        'Crie um slide de encerramento com um próximo passo.',
        'Arraste as miniaturas e teste outra ordem.',
        'Salve como Reuniao_Equipe_2026-07.pptx.',
      ],
    },
    { kind: 'heading', text: 'Salvar sem perder o original' },
    {
      kind: 'list',
      items: [
        'Use um nome que mostre assunto e versão.',
        'Faça uma cópia antes de uma alteração grande.',
        'Mantenha o PPTX para edição.',
        'Gere PDF apenas quando precisar de uma versão de leitura ou contingência.',
        'Feche e abra novamente o arquivo para confirmar onde ele foi salvo.',
      ],
    },
    {
      kind: 'keyIdea',
      text: 'Você dominou o capítulo quando explica apresentação, slide, layout e notas com suas palavras.',
    },
  ],
  summary: [
    'A apresentação é o arquivo inteiro; cada slide é um cartão dentro dela.',
    'O layout organiza espaços prontos para diferentes tipos de conteúdo.',
    'Planeje o público e a mensagem antes de escolher efeitos visuais.',
  ],
};

const CAP_2: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Capítulo 2 — Texto, temas e uma aparência fácil de ler',
    pages: '7–8',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Transforme texto em uma mensagem visual simples, legível e consistente.',
    },
    { kind: 'heading', text: 'A mensagem vem antes da aparência' },
    {
      kind: 'paragraph',
      text: 'O título deve dizer o que o público precisa perceber. Um título como "Pedidos atrasados cresceram em junho" informa mais que "Status dos pedidos". O corpo do slide oferece poucas evidências; explicações longas ficam na fala, nas notas ou em um documento de apoio.',
    },
    {
      kind: 'analogy',
      text: 'O título é a placa da porta. Ele avisa o que existe naquela sala antes de a pessoa entrar.',
    },
    { kind: 'heading', text: 'Hierarquia visual simples' },
    {
      kind: 'table',
      headers: ['Nível', 'Função', 'Exemplo'],
      rows: [
        ['Título', 'Entregar a ideia principal', 'Prazo caiu de 8 para 5 dias'],
        ['Corpo', 'Mostrar evidências curtas', 'Três fatores principais'],
        ['Destaque', 'Chamar atenção para o essencial', '5 dias'],
        ['Notas', 'Guardar detalhes da fala', 'Método e observações'],
      ],
    },
    { kind: 'heading', text: 'Use temas com cuidado' },
    {
      kind: 'analogy',
      text: 'Um tema funciona como o uniforme de uma equipe: cria unidade sem tornar todas as pessoas idênticas.',
    },
    {
      kind: 'steps',
      items: [
        'Abra uma apresentação curta.',
        'Vá à guia Design.',
        'Passe por alguns temas sem confirmar.',
        'Escolha um tema legível e coerente com o assunto.',
        'Teste uma variação de cor.',
        'Confira todos os slides, não apenas a capa.',
        'Ajuste o layout quando algum texto ficar apertado.',
      ],
    },
    { kind: 'heading', text: 'Contraste e conforto de leitura' },
    {
      kind: 'list',
      items: [
        'Use texto grande o bastante para ser lido a distância.',
        'Prefira fundo simples atrás do texto.',
        'Não use apenas vermelho e verde para diferenciar estados.',
        'Evite frases inteiras em letras maiúsculas.',
        'Use negrito apenas para o ponto mais importante.',
        'Deixe espaço livre para a mensagem respirar.',
      ],
    },
    {
      kind: 'warning',
      text: 'Se o conteúdo só cabe quando a fonte fica muito pequena, divida o slide ou mova detalhes para as notas.',
    },
    { kind: 'heading', text: 'Pratique agora' },
    {
      kind: 'steps',
      items: [
        'Pegue um parágrafo fictício de cinco linhas.',
        'Escreva a conclusão em uma frase e use-a como título.',
        'Transforme o restante em três itens curtos.',
        'Mova explicações extras para as notas.',
        'Aplique um tema e confira o contraste.',
      ],
    },
  ],
  summary: [
    'O título deve mostrar a ideia principal do slide.',
    'Tema coordena cores, fontes e efeitos em toda a apresentação.',
    'Contraste, tamanho e espaço são mais importantes que decoração.',
  ],
};

const CAP_3: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Capítulo 3 — Imagens, formas, processos, dados e PDF',
    pages: '9–10',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Escolha elementos visuais que explicam a mensagem e prepare uma entrega revisada.',
    },
    {
      kind: 'analogy',
      text: 'Elementos visuais são placas de trânsito: ajudam quando orientam rapidamente e atrapalham quando aparecem em excesso.',
    },
    {
      kind: 'table',
      headers: ['Elemento', 'Use quando precisa', 'Evite quando'],
      rows: [
        ['Imagem', 'Mostrar pessoa, objeto, lugar ou situação', 'A imagem é apenas decoração'],
        ['Forma', 'Destacar, conectar ou criar uma etiqueta', 'Há formas demais competindo'],
        [
          'SmartArt',
          'Mostrar processo, ciclo ou hierarquia simples',
          'A estrutura é muito complexa',
        ],
        ['Tabela', 'Consultar valores exatos', 'A comparação visual é mais importante'],
        ['Gráfico', 'Comparar ou mostrar mudança', 'Há poucos números isolados'],
      ],
    },
    { kind: 'heading', text: 'Insira uma imagem sem deformar' },
    {
      kind: 'warning',
      text: 'Não use uma imagem encontrada na internet sem verificar permissão, autoria e regras de uso.',
    },
    {
      kind: 'steps',
      items: [
        'Vá à guia Inserir e escolha Imagens.',
        'Use uma imagem fictícia ou autorizada.',
        'Recorte as partes que não ajudam.',
        'Redimensione pelos cantos para manter a proporção.',
        'Alinhe a imagem com os outros elementos.',
        'Adicione legenda quando a origem ou contexto for importante.',
        'Escreva um texto alternativo que explique o conteúdo útil.',
      ],
    },
    { kind: 'heading', text: 'Mostre um processo' },
    {
      kind: 'paragraph',
      text: 'SmartArt funciona bem para sequências curtas e estáveis. Formas oferecem mais controle, mas exigem alinhamento e manutenção manual.',
    },
    {
      kind: 'steps',
      items: [
        'Escreva as etapas em uma lista curta.',
        'Vá a Inserir e escolha SmartArt.',
        'Selecione um modelo de Processo.',
        'Reduza o texto de cada etapa.',
        'Confira se a ordem é clara mesmo sem cor.',
      ],
    },
    { kind: 'heading', text: 'Crie um gráfico que responda uma pergunta' },
    {
      kind: 'steps',
      items: [
        'Escreva a pergunta, como "qual setor recebeu mais solicitações".',
        'Insira um gráfico de colunas.',
        'Troque os dados de exemplo por valores fictícios.',
        'Dê ao gráfico um título que mostre a conclusão.',
        'Confira período, unidade, categorias e origem.',
        'Remova efeitos 3D e decoração que não ajudam.',
      ],
    },
    { kind: 'heading', text: 'Exporte e confira' },
    {
      kind: 'warning',
      text: 'Guarde o PPTX editável. O PDF é ótimo para leitura e contingência, mas não preserva todas as animações e interações.',
    },
    {
      kind: 'steps',
      items: [
        'Revise os slides no modo de classificação.',
        'Inicie a apresentação e confira a leitura.',
        'Use Arquivo e Exportar ou Salvar Como.',
        'Escolha PDF.',
        'Abra o PDF e confira páginas, fontes, imagens e links.',
      ],
    },
  ],
  summary: [
    'Imagem mostra; forma destaca; SmartArt organiza; tabela consulta; gráfico compara.',
    'Mantenha proporções, autorização de uso e texto alternativo.',
    'Abra e confira o PDF depois da exportação.',
  ],
};

const CAP_4: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Capítulo 4 — Público, objetivo, roteiro e narrativa',
    pages: '12–13',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Organize slides em uma história que ajude o público a compreender e decidir.',
    },
    { kind: 'heading', text: 'Comece pelo público' },
    {
      kind: 'analogy',
      text: 'Preparar uma apresentação é guiar alguém por uma cidade. O objetivo é o destino; o roteiro é o caminho.',
    },
    {
      kind: 'list',
      items: [
        'Quem vai assistir?',
        'O que essas pessoas já sabem?',
        'Quanto tempo existe?',
        'Qual problema precisa ser entendido?',
        'Qual decisão ou ação é esperada?',
      ],
    },
    { kind: 'heading', text: 'Escreva a bússola da apresentação' },
    {
      kind: 'template',
      label: 'Modelo para preencher',
      text: 'Ao final, o público deve entender que… e deve fazer….',
    },
    {
      kind: 'paragraph',
      text: 'Se a frase estiver confusa, a apresentação também ficará confusa.',
    },
    {
      kind: 'table',
      headers: ['Parte', 'Pergunta', 'Função'],
      rows: [
        ['Abertura', 'Por que estamos aqui?', 'Criar contexto'],
        ['Desenvolvimento', 'O que sabemos?', 'Mostrar fatos e comparação'],
        ['Conclusão', 'O que isso significa?', 'Responder à pergunta'],
        ['Próximo passo', 'Quem faz o quê e quando?', 'Transformar entendimento em ação'],
      ],
    },
    { kind: 'heading', text: 'Monte um storyboard' },
    {
      kind: 'steps',
      items: [
        'Escreva a mensagem central em uma frase.',
        'Crie cartões de papel ou slides vazios.',
        'Dê a cada cartão um título informativo.',
        'Organize abertura, desenvolvimento e conclusão.',
        'Remova qualquer cartão que não ajude o objetivo.',
        'Acrescente uma evidência para cada afirmação importante.',
        'Escreva a chamada para ação no último slide.',
      ],
    },
    { kind: 'heading', text: 'Dados, fontes e honestidade' },
    {
      kind: 'warning',
      text: 'Uma apresentação bonita não corrige um dado errado. Confira a fonte antes de investir no visual.',
    },
    {
      kind: 'list',
      items: [
        'Informe período e unidade.',
        'Use uma fonte confiável e autorizada.',
        'Mostre limitações importantes.',
        'Não corte eixos para exagerar diferenças.',
        'Não escolha apenas os dados que confirmam sua opinião.',
        'Diferencie fato, hipótese e recomendação.',
      ],
    },
  ],
  summary: [
    'Objetivo é o resultado esperado; roteiro é o caminho até ele.',
    'Títulos informativos podem contar a história mesmo sem a fala.',
    'Toda afirmação importante precisa de evidência e contexto.',
  ],
};

const CAP_5: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Capítulo 5 — Composição, alinhamento, camadas e multimídia',
    pages: '14–15',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Organize objetos, processos, dados, áudio e vídeo com equilíbrio e propósito.',
    },
    { kind: 'heading', text: 'Crie ordem com alinhamento e espaço' },
    {
      kind: 'paragraph',
      text: 'Objetos alinhados parecem pertencer à mesma estrutura. Espaços regulares ajudam o olhar a perceber grupos e prioridades.',
    },
    {
      kind: 'analogy',
      text: 'Montar um slide é arrumar uma mesa. Alinhamento cria fileiras, proximidade forma grupos e espaço livre evita confusão.',
    },
    {
      kind: 'steps',
      items: [
        'Ative guias e linhas de grade quando ajudarem.',
        'Selecione objetos relacionados.',
        'Use Alinhar para criar uma borda comum.',
        'Use Distribuir para igualar espaços.',
        'Agrupe elementos que funcionam juntos.',
        'Teste a leitura no modo de apresentação.',
      ],
    },
    { kind: 'heading', text: 'Controle camadas e ordem de leitura' },
    {
      kind: 'list',
      items: [
        'Use Trazer para Frente e Enviar para Trás com intenção.',
        'Abra o Painel de Seleção para localizar objetos escondidos.',
        'Dê nomes claros, como "Título do gráfico" ou "Etapa 1".',
        'Organize uma ordem de leitura lógica para leitores de tela.',
        'Evite objetos invisíveis ou esquecidos fora do slide.',
      ],
    },
    { kind: 'heading', text: 'Escolha a melhor forma de mostrar dados' },
    {
      kind: 'table',
      headers: ['Pergunta', 'Forma útil', 'Cuidado'],
      rows: [
        ['Qual valor é exato?', 'Tabela pequena', 'Não lotar de colunas'],
        ['Qual categoria é maior?', 'Barras ou colunas', 'Ordenar quando fizer sentido'],
        ['Como mudou no tempo?', 'Linha', 'Mostrar período completo'],
        ['Como funciona o fluxo?', 'SmartArt ou formas', 'Manter poucas etapas'],
      ],
    },
    { kind: 'heading', text: 'Áudio e vídeo sem surpresas' },
    {
      kind: 'warning',
      text: 'Não publique imagem, voz ou vídeo de uma pessoa sem autorização adequada.',
    },
    {
      kind: 'steps',
      items: [
        'Use multimídia somente quando ela explicar melhor.',
        'Insira um trecho curto e autorizado.',
        'Defina se inicia ao clicar ou automaticamente.',
        'Teste som, legenda, proporção e reprodução.',
        'Leve uma alternativa, como imagem ou PDF.',
        'Teste novamente no computador e na sala de destino.',
      ],
    },
  ],
  summary: [
    'Alinhamento e distribuição criam ordem; proximidade mostra relações.',
    'O Painel de Seleção ajuda a controlar camadas e ordem de leitura.',
    'Multimídia deve ser testada e usada apenas quando melhora a explicação.',
  ],
};

const CAP_6: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Capítulo 6 — Movimento, notas, ensaio e apresentação',
    pages: '16–17',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Use movimento para orientar a atenção e apresente com notas, tempo e acessibilidade.',
    },
    { kind: 'heading', text: 'Transição e animação são coisas diferentes' },
    {
      kind: 'analogy',
      text: 'Transição é abrir a porta para outra sala. Animação é mover algo dentro da sala.',
    },
    {
      kind: 'table',
      headers: ['Recurso', 'Onde acontece', 'Uso útil'],
      rows: [
        ['Transição', 'Entre um slide e o próximo', 'Marcar mudança de seção'],
        ['Animação', 'Em um objeto dentro do slide', 'Revelar sequência ou mudança'],
      ],
    },
    { kind: 'heading', text: 'Use movimento com propósito' },
    {
      kind: 'warning',
      text: 'Evite movimento rápido, piscadas e excesso de efeitos. Eles podem distrair, cansar ou dificultar a compreensão.',
    },
    {
      kind: 'steps',
      items: [
        'Selecione o objeto que realmente precisa de movimento.',
        'Escolha um efeito discreto.',
        'Abra o Painel de Animação.',
        'Defina início e duração.',
        'Visualize desde o começo do slide.',
        'Remova efeitos que não melhoram a explicação.',
      ],
    },
    { kind: 'heading', text: 'Notas que ajudam, sem virar roteiro decorado' },
    {
      kind: 'list',
      items: [
        'Escreva palavras-chave e dados que precisam ser citados.',
        'Marque a transição para o próximo assunto.',
        'Inclua a fonte de uma informação importante.',
        'Não copie um texto enorme para ler sem olhar o público.',
        'Prepare uma frase curta para explicar cada gráfico ou imagem.',
      ],
    },
    { kind: 'heading', text: 'Apresente e ensaie' },
    {
      kind: 'steps',
      items: [
        'Inicie do começo com F5 ou do slide atual com Shift + F5.',
        'Ative o Modo do Apresentador quando houver duas telas.',
        'Confira slide atual, próximo slide, notas e tempo.',
        'Teste avanço, retorno, ponteiro e tela preta.',
        'Cronometre a apresentação inteira.',
        'Faça um teste no equipamento real.',
        'Leve PDF como contingência.',
      ],
    },
  ],
  checklist: [
    'Contraste e tamanho do texto conferidos.',
    'Texto alternativo e ordem de leitura definidos.',
    'Legendas presentes nos vídeos.',
    'Explicação oral preparada para imagens e gráficos.',
    'Tempo suficiente para leitura de cada slide.',
    'Verificador de Acessibilidade executado.',
  ],
  summary: [
    'Transição ocorre entre slides; animação ocorre dentro do slide.',
    'Movimento deve explicar sequência ou mudança, não competir com a mensagem.',
    'Notas, ensaio e Modo do Apresentador dão segurança à apresentação.',
  ],
};

const CAP_7: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Capítulo 7 — Slide Mestre, layouts e modelos reutilizáveis',
    pages: '19–20',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Crie uma base visual reutilizável para reduzir retrabalho e diferenças entre arquivos.',
    },
    { kind: 'heading', text: 'Mestre, layout, tema e modelo' },
    {
      kind: 'table',
      headers: ['Recurso', 'Pense como', 'Função'],
      rows: [
        ['Slide Mestre', 'Planta da casa', 'Controlar padrões compartilhados'],
        ['Layout', 'Tipo de cômodo', 'Organizar um uso recorrente'],
        ['Tema', 'Paleta e acabamento', 'Coordenar cores, fontes e efeitos'],
        ['Modelo .potx', 'Casa-modelo reutilizável', 'Começar novos arquivos com padrões'],
      ],
    },
    { kind: 'heading', text: 'Crie uma base reutilizável' },
    {
      kind: 'steps',
      items: [
        'Faça uma cópia da apresentação.',
        'Abra Exibição e Slide Mestre.',
        'Identifique o mestre principal e seus layouts.',
        'Defina fontes e cores do tema.',
        'Posicione elementos recorrentes no nível correto.',
        'Crie layouts apenas para necessidades repetidas.',
        'Nomeie os layouts com clareza.',
        'Feche o modo Slide Mestre.',
        'Reaplique layouts quando slides existentes não atualizarem.',
      ],
    },
    { kind: 'heading', text: 'Espaços reservados evitam retrabalho' },
    {
      kind: 'paragraph',
      text: 'Use espaços reservados quando outra pessoa precisará trocar título, imagem, texto ou gráfico. Eles preservam posição, tamanho e ordem de leitura melhor que caixas soltas.',
    },
    {
      kind: 'warning',
      text: 'Não coloque conteúdo específico de uma reunião no Slide Mestre. O mestre deve guardar padrões, não mensagens de um único arquivo.',
    },
  ],
  checklist: [
    'Testado com título curto e título longo.',
    'Testado com imagem horizontal e vertical.',
    'Testado com poucos e com muitos itens.',
    'Contraste e tamanho do texto conferidos.',
    'Ordem de leitura conferida.',
    'Rodapé, logo e numeração conferidos.',
    'Um arquivo novo foi criado a partir do .potx para confirmar o modelo.',
  ],
  summary: [
    'Slide Mestre controla padrões; layouts atendem tipos recorrentes de slide.',
    'Espaços reservados são melhores que caixas soltas para conteúdo substituível.',
    'Um modelo só está pronto depois de testes com conteúdos diferentes.',
  ],
};

const CAP_8: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Capítulo 8 — Dados do Excel, reutilização e versões',
    pages: '21–22',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Traga dados e slides de outras fontes com escolhas claras de atualização e controle.',
    },
    { kind: 'heading', text: 'Imagem, incorporação ou vínculo' },
    {
      kind: 'analogy',
      text: 'Imagem é uma foto do quadro; incorporação leva uma cópia; vínculo abre uma janela para o quadro original.',
    },
    {
      kind: 'table',
      headers: ['Escolha', 'O que acontece', 'Principal cuidado'],
      rows: [
        ['Imagem', 'Cria uma fotografia estática', 'Não atualiza com a origem'],
        ['Incorporar', 'Guarda uma cópia editável no PPTX', 'Pode aumentar o arquivo'],
        [
          'Vincular',
          'Mantém ligação com o arquivo de origem',
          'Pode quebrar por caminho ou permissão',
        ],
      ],
    },
    { kind: 'heading', text: 'Traga um gráfico do Excel' },
    {
      kind: 'warning',
      text: 'Um vínculo pode funcionar no seu computador e falhar em outro. Sempre teste no local de apresentação e tenha uma versão estática de contingência.',
    },
    {
      kind: 'steps',
      items: [
        'Confirme fonte, período e data de atualização.',
        'Crie ou revise o gráfico no Excel.',
        'Copie o gráfico.',
        'Use Colar Especial no PowerPoint.',
        'Escolha imagem, incorporação ou vínculo conscientemente.',
        'Escreva unidade, período e fonte no slide.',
        'Altere um valor fictício na origem para testar o vínculo.',
        'Feche, reabra e teste no computador de apresentação.',
      ],
    },
    { kind: 'heading', text: 'Reutilize slides sem importar problemas' },
    {
      kind: 'list',
      items: [
        'Use Reutilizar Slides quando a fonte é autorizada.',
        'Decida se deve preservar ou adaptar a formatação.',
        'Revise data, autoria e fonte dos dados.',
        'Atualize tema, fontes, texto alternativo e ordem de leitura.',
        'Remova comentários, notas ou elementos que não pertencem à nova apresentação.',
      ],
    },
    { kind: 'heading', text: 'Colaboração e versões' },
    {
      kind: 'steps',
      items: [
        'Mantenha um único arquivo compartilhado quando possível.',
        'Defina quem pode editar e quem apenas visualiza.',
        'Use comentários para dúvidas e decisões.',
        'Resolva comentários concluídos.',
        'Consulte o histórico quando precisar recuperar uma versão.',
        'Identifique claramente a versão aprovada.',
        'Evite enviar várias cópias paralelas sem controle.',
      ],
    },
  ],
  summary: [
    'Imagem é estática, incorporação guarda uma cópia e vínculo depende da origem.',
    'Slides reutilizados precisam de revisão de fonte, data, tema e acessibilidade.',
    'Coautoria funciona melhor quando existe uma versão aprovada claramente identificada.',
  ],
};

const CAP_9: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Capítulo 9 — Gravação, inspeção, segurança e distribuição',
    pages: '23–24',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Grave, teste e prepare os formatos finais sem expor informações ou enviar a versão errada.',
    },
    { kind: 'heading', text: 'Grave primeiro uma amostra' },
    {
      kind: 'analogy',
      text: 'Gravar uma amostra é provar uma colher da receita antes de servir a panela inteira.',
    },
    {
      kind: 'steps',
      items: [
        'Faça uma cópia de trabalho.',
        'Revise roteiro, notas e acessibilidade.',
        'Teste microfone, câmera e ambiente.',
        'Grave um único slide.',
        'Reproduza e confira voz, tempo, vídeo e avanço.',
        'Corrija o problema antes de gravar o restante.',
        'Exporte uma amostra em vídeo e teste em outro reprodutor.',
      ],
    },
    { kind: 'heading', text: 'Escolha o formato pelo uso' },
    {
      kind: 'table',
      headers: ['Formato', 'Melhor para', 'O que conferir'],
      rows: [
        ['PPTX', 'Editar e apresentar', 'Fontes, vínculos, mídia e versão'],
        ['PDF', 'Ler, imprimir e usar como contingência', 'Páginas, links e legibilidade'],
        ['MP4', 'Assistir sem PowerPoint', 'Som, imagem, legendas e duração'],
      ],
    },
    {
      kind: 'warning',
      text: 'O Inspetor de Documento pode remover conteúdo. Use-o em uma cópia e guarde o original editável em local autorizado.',
    },
    { kind: 'heading', text: 'Segurança e privacidade' },
    {
      kind: 'list',
      items: [
        'Não compartilhe senhas no mesmo canal do arquivo.',
        'Proteção não substitui permissões adequadas.',
        'Nunca habilite macros de origem desconhecida.',
        'Não publique gravações com pessoas ou dados sem autorização.',
        'Comprima mídia apenas depois de guardar uma cópia de melhor qualidade.',
        'Revise destinatário, canal, permissão e prazo de acesso.',
      ],
    },
    { kind: 'heading', text: 'Monte o pacote de entrega' },
    {
      kind: 'steps',
      items: [
        'Identifique a versão aprovada.',
        'Inclua PPTX somente para quem pode editar.',
        'Inclua PDF para leitura e contingência.',
        'Inclua MP4 quando a gravação for necessária.',
        'Envie fontes e arquivos vinculados apenas quando autorizados.',
        'Abra cada arquivo final e faça uma última conferência.',
      ],
    },
  ],
  checklist: [
    'Títulos, datas, nomes e números corretos.',
    'Imagens, voz e mídias autorizadas.',
    'Links e vínculos funcionando.',
    'Notas sem informação indevida.',
    'Comentários resolvidos.',
    'Dados ocultos inspecionados em uma cópia.',
    'Acessibilidade verificada.',
    'Arquivo aberto no equipamento de destino.',
  ],
  summary: [
    'Grave primeiro uma amostra curta e confira som, tempo, vídeo e avanço.',
    'Execute inspeções em uma cópia, porque algumas remoções não podem ser desfeitas.',
    'PPTX, PDF e vídeo têm finalidades diferentes e devem ser testados.',
  ],
};

const GUIA_RAPIDO: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Guia de consulta rápida e Referências oficiais',
    pages: '27–29',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Use esta seção para relembrar conceitos. Volte aos capítulos quando precisar compreender o motivo ou o passo a passo completo.',
    },
    { kind: 'heading', text: 'Qual elemento escolher?' },
    {
      kind: 'table',
      headers: ['Necessidade', 'Elemento sugerido'],
      rows: [
        ['Mostrar algo concreto', 'Imagem'],
        ['Destacar ou conectar', 'Forma'],
        ['Explicar processo ou hierarquia simples', 'SmartArt'],
        ['Consultar valores exatos', 'Tabela'],
        ['Comparar ou mostrar mudança', 'Gráfico'],
      ],
    },
    { kind: 'heading', text: 'Antes de apresentar' },
    {
      kind: 'list',
      items: [
        'O título de cada slide entrega a ideia principal.',
        'Os dados têm período, unidade e fonte.',
        'O contraste e o tamanho do texto permitem leitura a distância.',
        'As notas apoiam a fala sem virar roteiro decorado.',
        'A apresentação foi cronometrada e testada no equipamento real.',
        'Existe PDF como contingência.',
      ],
    },
    { kind: 'heading', text: 'Referências oficiais' },
    {
      kind: 'paragraph',
      text: 'Os procedimentos deste módulo foram conferidos com a documentação da Microsoft. Recursos e menus podem mudar entre versões. Os endereços completos estão nas últimas páginas do e-book, em "Materiais de apoio".',
    },
  ],
};

/**
 * Rubrica do projeto final: critérios e pesos transcritos da tabela
 * "Critérios de avaliação" (página 26). O e-book fixa a nota mínima em 70% e
 * descreve a faixa 70–89% como "Funcional: conclui com consultas pontuais e
 * sem falha crítica".
 */
const RUBRICA_PROJETO_FINAL: ActivityRubric = {
  passingScore: 70,
  minWords: 250,
  criticalFailures: FALHAS_CRITICAS,
  criteria: [
    {
      id: 'objetivo-e-narrativa',
      title: 'Objetivo e narrativa',
      weight: 15,
      whatToObserve: 'Mensagem, sequência e próximo passo claros, com público e decisão definidos.',
    },
    {
      id: 'estrutura-e-legibilidade',
      title: 'Estrutura e legibilidade',
      weight: 15,
      whatToObserve: 'Layouts, tamanho de texto e contraste adequados em todos os slides.',
    },
    {
      id: 'elementos-visuais-e-dados',
      title: 'Elementos visuais e dados',
      weight: 15,
      whatToObserve: 'Imagens autorizadas e dados corretos, com período, unidade e fonte.',
    },
    {
      id: 'composicao-e-consistencia',
      title: 'Composição e consistência',
      weight: 10,
      whatToObserve: 'Alinhamento, espaço e padrões coerentes entre os slides.',
    },
    {
      id: 'apresentacao-e-movimento',
      title: 'Apresentação e movimento',
      weight: 10,
      whatToObserve: 'Notas, ensaio cronometrado e efeitos usados com propósito.',
    },
    {
      id: 'acessibilidade',
      title: 'Acessibilidade',
      weight: 15,
      whatToObserve: 'Ordem de leitura, textos alternativos, contraste e verificação executada.',
    },
    {
      id: 'padronizacao-e-reutilizacao',
      title: 'Padronização e reutilização',
      weight: 10,
      whatToObserve: 'Mestre, layouts ou modelo testados com conteúdos curtos e longos.',
    },
    {
      id: 'governanca-e-entrega',
      title: 'Governança e entrega',
      weight: 10,
      whatToObserve: 'Versão identificada, inspeção em cópia, formatos corretos e checklist.',
    },
  ],
};

const CONTEUDO: Record<string, LessonContent> = {
  'Capítulo 1 — A apresentação como história em cartões': CAP_1,
  'Capítulo 2 — Texto, temas e uma aparência fácil de ler': CAP_2,
  'Capítulo 3 — Imagens, formas, processos, dados e PDF': CAP_3,
  'Capítulo 4 — Público, objetivo, roteiro e narrativa': CAP_4,
  'Capítulo 5 — Composição, alinhamento, camadas e multimídia': CAP_5,
  'Capítulo 6 — Movimento, notas, ensaio e apresentação': CAP_6,
  'Capítulo 7 — Slide Mestre, layouts e modelos reutilizáveis': CAP_7,
  'Capítulo 8 — Dados do Excel, reutilização e versões': CAP_8,
  'Capítulo 9 — Gravação, inspeção, segurança e distribuição': CAP_9,
  'Guia de consulta rápida e referências oficiais': GUIA_RAPIDO,
};

const RUBRICAS: Record<string, Pick<SeedLesson, 'rubric' | 'rubricReference'>> = {
  'Projeto final integrado': {
    rubric: RUBRICA_PROJETO_FINAL,
    rubricReference: {
      module: EBOOK,
      chapter: 'Projeto final integrado — Regras e Critérios de avaliação',
      pages: '25–26',
    },
  },
};

export const MODULE_04_ENRICHMENT: SectionEnrichment = {
  conteudo: CONTEUDO,
  rubricas: RUBRICAS,
};
