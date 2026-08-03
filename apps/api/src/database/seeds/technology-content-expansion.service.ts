import { Logger } from '@nestjs/common';
import { LessonType } from '@romalearn/contracts';
import { DataSource } from 'typeorm';
import { Course } from '../../catalog/entities/course.entity';
import { Lesson } from '../../catalog/entities/lesson.entity';
import { conteudoDaAulaTecnica } from './content/tecnologia';
import { TECHNOLOGY_COURSES } from './technology-catalog-data';

interface ActivityGuide {
  context: string;
  objective: string;
  deliverables: string[];
  minimumScenarios: string[];
  reflection: string[];
}

const ACTIVITY_GUIDES: Record<string, ActivityGuide> = {
  'Prática — Escreva seu primeiro algoritmo': {
    context: 'Você precisa organizar uma rotina semanal de estudos sem depender apenas da memória.',
    objective:
      'Transformar uma necessidade real em entradas, passos, decisões e saídas verificáveis.',
    deliverables: [
      'algoritmo em linguagem natural ou pseudocódigo',
      'lista das entradas e saídas',
      'teste de mesa com dois cenários',
      'explicação de uma melhoria feita após testar',
    ],
    minimumScenarios: [
      'sem tarefa atrasada',
      'com tarefa atrasada e prioridade alta',
      'entrada incompleta',
    ],
    reflection: [
      'Qual instrução estava ambígua?',
      'Que regra você precisou acrescentar depois do teste?',
    ],
  },
  'Prática — Controle de despesas': {
    context:
      'Uma pessoa quer acompanhar despesas do mês e receber um alerta quando ultrapassar o orçamento.',
    objective: 'Aplicar variáveis, operadores, condições, repetição, acumulador e validação.',
    deliverables: [
      'pseudocódigo completo',
      'tabela com despesas fictícias',
      'cálculo do total',
      'mensagem de situação do orçamento',
    ],
    minimumScenarios: [
      'abaixo do orçamento',
      'exatamente no limite',
      'acima do limite',
      'despesa inválida',
    ],
    reflection: ['Onde o acumulador é inicializado?', 'Como o algoritmo impede valor negativo?'],
  },
  'Projeto final — Organizador de tarefas': {
    context:
      'Construa a especificação lógica de um organizador que cadastre, priorize, conclua e resuma tarefas.',
    objective:
      'Integrar decomposição, dados, condições, loops, funções e testes em uma solução coerente.',
    deliverables: [
      'repositório com README',
      'pseudocódigo ou implementação',
      'funções separadas por responsabilidade',
      'plano de testes',
      'relato das decisões',
    ],
    minimumScenarios: [
      'lista vazia',
      'cadastro válido',
      'prioridade inválida',
      'conclusão de tarefa inexistente',
      'relatório com tarefas pendentes e concluídas',
    ],
    reflection: [
      'Que parte você separaria em módulo?',
      'Qual regra protege a consistência dos dados?',
    ],
  },
  'Prática — Seu primeiro histórico': {
    context: 'Crie um pequeno repositório de anotações para registrar sua evolução nos estudos.',
    objective: 'Praticar status, stage, diff e commits pequenos com intenção clara.',
    deliverables: [
      'repositório local',
      'ao menos três commits',
      'captura ou transcrição do histórico',
      'explicação do que entrou em cada commit',
    ],
    minimumScenarios: [
      'arquivo novo',
      'arquivo modificado',
      'mudança deixada fora do stage de propósito',
    ],
    reflection: [
      'Por que as mudanças foram separadas?',
      'O que `git status` mostrou em cada etapa?',
    ],
  },
  'Prática — Fluxo de feature': {
    context: 'Implemente uma melhoria em uma branch sem alterar diretamente a branch principal.',
    objective: 'Executar o fluxo branch, commits, push, pull request, revisão e merge.',
    deliverables: [
      'branch com nome descritivo',
      'commits pequenos',
      'pull request',
      'passos de validação',
      'registro do merge',
    ],
    minimumScenarios: [
      'mudança concluída',
      'ajuste após revisão',
      'conflito simulado ou explicação de como resolver',
    ],
    reflection: ['O PR forneceu contexto suficiente?', 'Que risco a branch evitou?'],
  },
  'Projeto final — Repositório profissional': {
    context:
      'Transforme um projeto simples em evidência profissional compreensível para outra pessoa.',
    objective: 'Demonstrar versionamento, colaboração, documentação e organização de entrega.',
    deliverables: [
      'repositório remoto',
      'README completo',
      'issues',
      'branch de feature',
      'pull request',
      'release versionada',
    ],
    minimumScenarios: [
      'clone em outra pasta',
      'execução seguindo apenas o README',
      'correção registrada após revisão',
    ],
    reflection: [
      'Que evidência mostra sua evolução?',
      'Outra pessoa consegue executar sem conversar com você?',
    ],
  },
  'Prática — Página de apresentação': {
    context: 'Crie a estrutura de uma página profissional antes de pensar em aparência.',
    objective:
      'Aplicar HTML semântico, hierarquia de títulos, links, imagens e formulário acessível.',
    deliverables: [
      'HTML validado',
      'seções de apresentação, competências, projetos e contato',
      'labels nos campos',
      'textos alternativos adequados',
    ],
    minimumScenarios: ['navegação por teclado', 'imagem indisponível', 'campo obrigatório vazio'],
    reflection: [
      'Cada elemento foi escolhido pelo significado?',
      'A página ainda faz sentido sem CSS?',
    ],
  },
  'Prática — Seção responsiva': {
    context: 'Uma lista de serviços precisa funcionar bem em celular, tablet e desktop.',
    objective:
      'Aplicar box model, Flexbox ou Grid, unidades fluidas e breakpoints orientados ao conteúdo.',
    deliverables: [
      'seção de cards',
      'CSS organizado',
      'evidências em três larguras',
      'foco visível e contraste verificado',
    ],
    minimumScenarios: ['320 px', '768 px', '1440 px', 'texto maior que o esperado'],
    reflection: [
      'Por que o layout quebra naquele ponto?',
      'Qual decisão evita rolagem horizontal?',
    ],
  },
  'Projeto final — Landing page profissional': {
    context: 'Desenvolva uma landing page para apresentar um serviço, produto ou projeto realista.',
    objective:
      'Integrar semântica, acessibilidade, design responsivo, formulário, performance e publicação.',
    deliverables: [
      'site publicado',
      'repositório',
      'README',
      'relatório breve do Lighthouse',
      'checklist de acessibilidade',
    ],
    minimumScenarios: [
      'mobile',
      'desktop',
      'navegação por teclado',
      'imagem lenta ou ausente',
      'formulário inválido',
    ],
    reflection: [
      'Que decisão melhora a conversão sem prejudicar acessibilidade?',
      'O que você otimizaria com mais tempo?',
    ],
  },
  'Prática — Lista de tarefas em memória': {
    context: 'Modele tarefas em JavaScript antes de conectá-las à interface.',
    objective: 'Aplicar variáveis, funções, arrays, objetos e métodos de coleção.',
    deliverables: [
      'estrutura da tarefa',
      'funções de adicionar, concluir, filtrar e remover',
      'exemplos no console',
      'testes manuais documentados',
    ],
    minimumScenarios: ['lista vazia', 'duas prioridades', 'id inexistente', 'filtro sem resultado'],
    reflection: [
      'Qual função altera estado?',
      'Onde uma cópia seria mais segura que mutação direta?',
    ],
  },
  'Prática — Lista de tarefas interativa': {
    context: 'Conecte a lógica da lista a um formulário e a uma visualização no navegador.',
    objective: 'Praticar DOM, eventos, validação, renderização e armazenamento local.',
    deliverables: [
      'interface funcional',
      'mensagens de validação',
      'persistência local',
      'estado vazio',
      'navegação por teclado',
    ],
    minimumScenarios: [
      'cadastro válido',
      'título vazio',
      'recarregamento da página',
      'remoção da última tarefa',
    ],
    reflection: [
      'Como evita registrar o mesmo evento duas vezes?',
      'O estado é a fonte da verdade ou o HTML?',
    ],
  },
  'Projeto final — Painel de informações': {
    context:
      'Crie um painel que consulta uma API pública e permita encontrar informações relevantes.',
    objective: 'Integrar requisições assíncronas, estado, filtros, DOM e tratamento de falhas.',
    deliverables: [
      'aplicação publicada',
      'estados de carregamento, erro e vazio',
      'filtro',
      'README',
      'API e limites documentados',
    ],
    minimumScenarios: [
      'resposta com dados',
      'lista vazia',
      'falha de rede',
      'busca sem resultado',
      'requisição lenta',
    ],
    reflection: [
      'Como o usuário entende o que está acontecendo?',
      'Que parte poderia ser separada em módulo?',
    ],
  },
  'Prática — Calculadora de orçamento': {
    context: 'Crie um programa de terminal que consolide receitas e despesas fictícias.',
    objective: 'Aplicar entrada, conversão, validação, condições e loops em Python.',
    deliverables: [
      'script executável',
      'funções de entrada e cálculo',
      'resumo final',
      'instruções de execução',
    ],
    minimumScenarios: ['saldo positivo', 'saldo zero', 'saldo negativo', 'valor não numérico'],
    reflection: ['Onde a entrada é validada?', 'O cálculo está separado da exibição?'],
  },
  'Prática — Cadastro em memória': {
    context: 'Modele um cadastro simples de contatos ou produtos sem banco de dados.',
    objective: 'Aplicar listas, dicionários, funções, módulos e tratamento de erros.',
    deliverables: [
      'operações de inclusão, busca, edição e remoção',
      'menu de terminal',
      'validações',
      'casos de teste',
    ],
    minimumScenarios: [
      'cadastro válido',
      'identificador duplicado',
      'busca inexistente',
      'edição inválida',
    ],
    reflection: [
      'Qual estrutura representa melhor cada registro?',
      'Que função possui responsabilidade demais?',
    ],
  },
  'Projeto final — Organizador de relatórios': {
    context:
      'Uma equipe recebe arquivos CSV e precisa consolidar totais por categoria sem alterar os originais.',
    objective:
      'Integrar arquivos, estruturas de dados, funções, exceções, caminhos e geração de relatório.',
    deliverables: [
      'script',
      'arquivos de exemplo',
      'relatório gerado',
      'README',
      'log de registros inválidos',
    ],
    minimumScenarios: [
      'arquivo válido',
      'arquivo vazio',
      'coluna ausente',
      'valor inválido',
      'pasta inexistente',
    ],
    reflection: [
      'Como garante que o original não foi alterado?',
      'Como outra pessoa reproduz a execução?',
    ],
  },
  'Prática — Sistema de notas': {
    context:
      'Crie uma aplicação de console para calcular média e classificar o resultado de estudantes fictícios.',
    objective: 'Aplicar tipos, operadores, controle de fluxo e métodos em Java.',
    deliverables: [
      'projeto compilável',
      'métodos de cálculo e classificação',
      'validação de notas',
      'casos executados',
    ],
    minimumScenarios: ['aprovado', 'recuperação', 'reprovado', 'nota fora do intervalo'],
    reflection: [
      'A regra está concentrada em um método?',
      'Que tipo representa melhor a classificação?',
    ],
  },
  'Prática — Catálogo de produtos': {
    context: 'Modele produtos e categorias com regras de preço e disponibilidade.',
    objective: 'Praticar classes, objetos, construtores, encapsulamento, interfaces e composição.',
    deliverables: [
      'modelo de classes',
      'validações de estado',
      'operações de preço',
      'exemplos de uso',
    ],
    minimumScenarios: [
      'produto válido',
      'preço negativo',
      'produto indisponível',
      'desconto acima do limite',
    ],
    reflection: [
      'Qual regra pertence ao próprio objeto?',
      'Composição é mais adequada que herança neste caso?',
    ],
  },
  'Projeto final — Gestão de biblioteca': {
    context: 'Crie uma aplicação de console para controlar livros, usuários e empréstimos.',
    objective: 'Integrar orientação a objetos, coleções, exceções, regras de domínio e testes.',
    deliverables: [
      'projeto Java',
      'modelo de domínio',
      'operações de empréstimo e devolução',
      'testes essenciais',
      'README',
    ],
    minimumScenarios: [
      'empréstimo válido',
      'livro indisponível',
      'usuário inexistente',
      'devolução duplicada',
      'limite de empréstimos',
    ],
    reflection: [
      'Que invariantes o domínio deve proteger?',
      'Que dependência poderia ser substituída em testes?',
    ],
  },
};

export class TechnologyContentExpansionService {
  private readonly logger = new Logger('TechnologyContentExpansion');

  constructor(private readonly dataSource: DataSource) {}

  async run(): Promise<void> {
    const courseRepository = this.dataSource.getRepository(Course);
    const lessonRepository = this.dataSource.getRepository(Lesson);
    let updated = 0;

    for (const courseData of TECHNOLOGY_COURSES) {
      const course = await courseRepository.findOne({ where: { slug: courseData.slug } });
      if (!course) throw new Error(`Curso técnico não encontrado: ${courseData.slug}`);

      for (const section of courseData.sections) {
        for (const lessonData of section.lessons) {
          const lesson = await lessonRepository.findOne({
            where: { courseId: course.id, title: lessonData.title },
          });
          if (!lesson)
            throw new Error(`Aula não encontrada: ${courseData.slug}/${lessonData.title}`);

          let contentMarkdown: string;

          if (lessonData.type === LessonType.RICH_TEXT) {
            const escrito = conteudoDaAulaTecnica(courseData.slug, lessonData.title);

            // Falhar aqui é deliberado. O gerador anterior preenchia qualquer
            // aula sem conteúdo com um texto de molde, e foi assim que as 49
            // leituras acabaram com 78% do texto igual entre si. Uma aula sem
            // conteúdo escrito precisa interromper o seed e aparecer.
            if (!escrito) {
              throw new Error(
                `Aula de leitura sem conteúdo escrito: ${courseData.slug}/${lessonData.title}. ` +
                  'Escreva o conteúdo em src/database/seeds/content/tecnologia/.',
              );
            }

            contentMarkdown = escrito;
          } else {
            contentMarkdown = this.buildActivityContent(
              lessonData.title,
              lessonData.activityInstructions ?? '',
            );
          }

          await lessonRepository.update(
            { id: lesson.id },
            {
              contentMarkdown,
              activityInstructions:
                lessonData.type === LessonType.PRACTICAL_ACTIVITY ? contentMarkdown : null,
            },
          );
          updated += 1;
        }
      }
    }

    this.logger.log(`${updated} aulas técnicas receberam conteúdo didático expandido.`);
  }

  private buildActivityContent(title: string, originalInstructions: string): string {
    const guide = ACTIVITY_GUIDES[title];
    if (!guide) {
      return [
        `# ${title}`,
        `## Objetivo\n\n${originalInstructions}`,
        '## Evidências esperadas\n\n- solução executável ou verificável;\n- explicação das decisões;\n- testes de cenário comum e de erro;\n- registro das dúvidas e aprendizados.',
        '## Critério de qualidade\n\nA entrega deve demonstrar compreensão do conteúdo anterior. Copiar uma solução sem conseguir explicá-la não demonstra aprendizagem.',
      ].join('\n\n');
    }

    return [
      `# ${title}`,
      `## Situação-problema\n\n${guide.context}`,
      `## O que esta atividade exercita\n\n${guide.objective}`,
      `## Enunciado\n\n${originalInstructions}`,
      `## Entregáveis\n\n${guide.deliverables.map((item) => `- ${item}`).join('\n')}`,
      `## Cenários mínimos de teste\n\n${guide.minimumScenarios.map((item) => `- ${item}`).join('\n')}`,
      `## Como desenvolver\n\n1. Releia a aula anterior e destaque as regras.\n2. Escreva o resultado esperado antes do código.\n3. Implemente a menor versão funcional.\n4. Execute cada cenário mínimo.\n5. Corrija uma falha por vez.\n6. Registre a solução e explique suas decisões.`,
      `## Reflexão obrigatória\n\n${guide.reflection.map((item) => `- ${item}`).join('\n')}`,
      '## Antes de enviar\n\n- [ ] Consigo executar ou demonstrar a solução.\n- [ ] Testei entradas comuns, limites e inválidas.\n- [ ] Expliquei o que fiz e por quê.\n- [ ] Não incluí senha, token ou dado pessoal.\n- [ ] Minha entrega é autoral e posso explicar cada parte.',
    ].join('\n\n');
  }
}
