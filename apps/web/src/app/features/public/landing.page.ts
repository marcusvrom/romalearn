import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CourseSummaryDto, ProgramSummaryDto, WEB_ROUTES } from '@romalearn/contracts';
import { CourseCardComponent, LoadingStateComponent } from '@romalearn/ui';
import { CatalogService } from '../../core/catalog.service';
import { PLATFORM_CONFIG } from '../../core/platform.config';
import { SeoService } from '../../core/seo.service';
import { RevealDirective } from '../../shared/reveal.directive';
import { HeroCanvasComponent } from './hero-canvas.component';

interface Faq {
  question: string;
  answer: string;
}

/**
 * Landing page.
 *
 * Regra do produto: nada de depoimento inventado, número de alunos fictício,
 * contador artificial ou urgência enganosa. A seção de depoimentos existe no
 * código, mas só aparece quando houver depoimentos reais cadastrados.
 */
@Component({
  selector: 'rl-landing-page',
  standalone: true,
  imports: [
    RouterLink,
    CourseCardComponent,
    LoadingStateComponent,
    HeroCanvasComponent,
    RevealDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './landing.page.html',
  styleUrl: './landing.page.scss',
})
export class LandingPage implements OnInit {
  private readonly catalog = inject(CatalogService);
  private readonly seo = inject(SeoService);
  readonly config = inject(PLATFORM_CONFIG);

  readonly routes = WEB_ROUTES;
  readonly loading = signal(true);
  readonly freeCourse = signal<CourseSummaryDto | null>(null);
  readonly paidCourses = signal<CourseSummaryDto[]>([]);
  readonly program = signal<ProgramSummaryDto | null>(null);

  /** Depoimentos reais entram aqui; enquanto vazio, a seção não é exibida. */
  readonly testimonials = signal<{ name: string; role: string; quote: string }[]>([]);

  /**
   * O que o aluno termina com as mãos.
   *
   * Cada item corresponde ao projeto final de um módulo, e os subitens saem
   * dos critérios da rubrica que o corrige — não é promessa de marketing, é a
   * lista do que a correção efetivamente observa.
   */
  readonly buildOutcomes = [
    {
      icon: '🗂️',
      source: 'Módulo 1 — Computador e Windows',
      title: 'Um escritório digital organizado',
      text: 'A estrutura de pastas e nomes que faz você achar qualquer arquivo em segundos, meses depois.',
      parts: [
        'Pastas e nomes com padrão',
        'Salvamento e exportação em PDF',
        'Backup e segurança básica',
      ],
    },
    {
      icon: '📄',
      source: 'Módulo 2 — Word',
      title: 'Um documento profissional de verdade',
      text: 'Não um texto solto: um documento com estrutura, sumário que se atualiza e revisão feita.',
      parts: [
        'Estilos, sumário e layout',
        'Revisão e acessibilidade',
        'Modelo reutilizável e mala direta',
      ],
    },
    {
      icon: '📊',
      source: 'Módulo 3 — Excel',
      title: 'Uma planilha de controle que se atualiza sozinha',
      text: 'Com fórmulas que recalculam, dados protegidos contra digitação errada e um resumo que responde perguntas.',
      parts: [
        'Fórmulas, filtros e Tabela Dinâmica',
        'Gráficos e indicadores',
        'Validação, proteção e entrega em XLSX e PDF',
      ],
    },
    {
      icon: '🎤',
      source: 'Módulo 4 — PowerPoint',
      title: 'Uma apresentação que sustenta uma reunião',
      text: 'Com começo, meio e fim, padrão visual consistente e legibilidade para quem está no fundo da sala.',
      parts: [
        'Narrativa e estrutura',
        'Slide Mestre e padronização',
        'Dados no slide e acessibilidade',
      ],
    },
    {
      icon: '🤖',
      source: 'Módulo 5 — Inteligência artificial',
      title: 'Um jeito responsável de usar IA no trabalho',
      text: 'Saber o que pode entrar no prompt, o que nunca pode, e como conferir o que a ferramenta devolveu.',
      parts: [
        'Onde a IA ajuda e onde atrapalha',
        'Dados que não podem ser expostos',
        'Conferência antes de entregar',
      ],
    },
    {
      icon: '🧭',
      source: 'Módulo gratuito — Carreira digital',
      title: 'Seu miniportfólio e seu plano de 30 dias',
      text: 'O mapa do que você já sabe fazer, as evidências que comprovam e o próximo passo escrito.',
      parts: [
        'Mapa de habilidades e evidências',
        'Perfil e presença profissional',
        'Plano de evolução de 30 dias',
      ],
    },
  ];

  /**
   * Setores citados no material como exemplo de onde essas competências
   * aparecem. A lista vem do Módulo gratuito, capítulo 1 — não é uma promessa
   * de contratação, e o texto ao lado deixa isso explícito.
   */
  readonly workSectors = [
    { icon: '🏢', name: 'Escritório', example: 'Documentos, relatórios e controles internos' },
    { icon: '🛒', name: 'Comércio', example: 'Estoque, pedidos e conferência de despesas' },
    { icon: '🏫', name: 'Escola', example: 'Listas, presença e comunicados' },
    { icon: '🏥', name: 'Saúde', example: 'Agendamentos, cadastros e planilhas de acompanhamento' },
    { icon: '💬', name: 'Atendimento', example: 'Registros, respostas padronizadas e histórico' },
    {
      icon: '📦',
      name: 'Logística e estoque',
      example: 'Contagens, recontagem por amostra e prazos',
    },
  ];

  readonly benefits = [
    {
      icon: '🧭',
      title: 'Do zero, sem pressa',
      text: 'Cada capítulo começa explicando o porquê antes do como, com analogias do dia a dia.',
    },
    {
      icon: '✍️',
      title: 'Prática guiada',
      text: 'Toda parte termina com uma atividade para você fazer com dados fictícios.',
    },
    {
      icon: '📁',
      title: 'Material oficial em PDF',
      text: 'Os e-books completos ficam disponíveis para download e consulta quando precisar.',
    },
    {
      icon: '🎓',
      title: 'Certificado verificável',
      text: 'Ao concluir, você recebe um certificado com código público de validação.',
    },
  ];

  readonly steps = [
    {
      number: '1',
      title: 'Crie sua conta',
      text: 'Leva menos de um minuto. Você já entra com acesso ao módulo gratuito.',
    },
    {
      number: '2',
      title: 'Estude no seu ritmo',
      text: 'O progresso fica salvo automaticamente. Volte de onde parou, no celular ou no computador.',
    },
    {
      number: '3',
      title: 'Pratique e comprove',
      text: 'Faça as atividades e os questionários de cada módulo para fixar o conteúdo.',
    },
    {
      number: '4',
      title: 'Receba o certificado',
      text: 'Ao cumprir os critérios do curso, o certificado em PDF é emitido automaticamente.',
    },
  ];

  readonly comparison = [
    { feature: 'Aulas de leitura com material oficial', free: true, paid: true },
    { feature: 'Atividades práticas', free: true, paid: true },
    { feature: 'Questionários com correção', free: true, paid: true },
    { feature: 'Certificado verificável', free: true, paid: true },
    { feature: 'Carreira digital, LinkedIn e networking', free: true, paid: false },
    { feature: 'Fundamentos de computador e Windows', free: false, paid: true },
    { feature: 'Word para rotinas administrativas', free: false, paid: true },
    { feature: 'Excel: fórmulas, gráficos e Tabelas Dinâmicas', free: false, paid: true },
    { feature: 'PowerPoint: narrativa, Slide Mestre e distribuição', free: false, paid: true },
    { feature: 'IA aplicada a processos administrativos', free: false, paid: true },
  ];

  readonly faqs: Faq[] = [
    {
      question: 'Preciso saber usar computador para começar?',
      answer:
        'Não. O Módulo 1 começa explicando o que é hardware, software e Windows, e como usar mouse e teclado sem medo. Se você nunca usou um computador, comece por ele.',
    },
    {
      question: 'O módulo gratuito é realmente gratuito?',
      answer:
        'Sim. Basta criar uma conta e fazer a matrícula gratuita. Não pedimos cartão de crédito e não há cobrança depois.',
    },
    {
      question: 'Preciso ter o Office instalado?',
      answer:
        'Para acompanhar os módulos de Word, Excel e PowerPoint é recomendável ter acesso aos programas. Os conceitos também ajudam quem usa alternativas parecidas.',
    },
    {
      question: 'Quanto tempo tenho para estudar?',
      answer:
        'O acesso não expira. Você estuda no seu ritmo e o progresso fica salvo entre sessões.',
    },
    {
      question: 'Como funciona o certificado?',
      answer:
        'O certificado é emitido quando você cumpre os critérios do curso: concluir as aulas, enviar as atividades práticas e ser aprovado nos questionários. Ele traz um código público que qualquer pessoa pode conferir na nossa página de validação.',
    },
    {
      question: 'O curso garante emprego?',
      answer:
        'Não. O material melhora seu preparo, sua clareza e as evidências do que você sabe fazer. Ele não garante emprego, salário, promoção ou aprovação em processo seletivo.',
    },
    {
      question: 'Posso estudar pelo celular?',
      answer:
        'Sim. Todas as telas funcionam no celular, incluindo o player de aulas e as atividades.',
    },
    {
      question: 'E se eu tiver dúvidas?',
      answer: `Escreva para ${'{{email}}'} e nossa equipe responde. O canal de suporte também fica no rodapé do site.`,
    },
  ];

  ngOnInit(): void {
    this.seo.apply({
      title: `Competências digitais para o trabalho`,
      description:
        'Trilha de cursos em português para quem está começando: computador e Windows, Word, ' +
        'Excel, PowerPoint e inteligência artificial aplicados à rotina administrativa. ' +
        'Comece pelo módulo gratuito.',
      path: '/',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'EducationalOrganization',
        name: this.config.name,
        description: this.config.tagline,
        url: this.config.siteUrl,
        email: this.config.supportEmail,
      },
    });

    this.catalog.listCourses().subscribe({
      next: (courses) => {
        this.freeCourse.set(courses.find((course) => course.isFree) ?? null);
        this.paidCourses.set(courses.filter((course) => !course.isFree));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    this.catalog.listPrograms().subscribe({
      next: (programs) => this.program.set(programs[0] ?? null),
      error: () => this.program.set(null),
    });
  }

  /** Substitui o marcador do e-mail de suporte na FAQ. */
  answerFor(faq: Faq): string {
    return faq.answer.replace('{{email}}', this.config.supportEmail);
  }
}
