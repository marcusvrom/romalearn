import { Injectable } from '@nestjs/common';
import { ActivityGrader, GradingInput, GradingOutcome } from './activity-grader';

/**
 * Corretor determinístico, sem chamada externa e sem custo.
 *
 * Ele **não** julga a qualidade do que o aluno fez — isso exige leitura. O
 * que faz é medir cobertura: para cada critério da rubrica, verifica se o
 * relato trata do assunto, comparando os termos relevantes do critério com o
 * texto entregue. É o suficiente para dar uma devolutiva honesta em quem
 * escreveu duas linhas genéricas, e é o padrão da plataforma quando não há
 * provedor de IA configurado.
 *
 * Nunca reprova sozinho por conteúdo: quando a cobertura fica na faixa
 * intermediária, marca a entrega como incerta e manda para revisão humana.
 */
@Injectable()
export class RulesActivityGrader implements ActivityGrader {
  /** Palavras sem valor discriminante na comparação de cobertura. */
  private static readonly STOPWORDS = new Set([
    'a',
    'à',
    'ao',
    'aos',
    'as',
    'às',
    'com',
    'como',
    'da',
    'das',
    'de',
    'do',
    'dos',
    'e',
    'em',
    'na',
    'nas',
    'no',
    'nos',
    'o',
    'os',
    'ou',
    'para',
    'pela',
    'pelas',
    'pelo',
    'pelos',
    'por',
    'que',
    'se',
    'sem',
    'sob',
    'sobre',
    'um',
    'uma',
    'uns',
    'umas',
    'the',
    'of',
    'and',
    'cada',
    'pelo',
    'menos',
    'quando',
    'onde',
    'qual',
    'quais',
    'aparece',
    'aparecem',
    'relato',
    'entrega',
    'aluno',
    'sua',
    'seu',
    'seus',
    'suas',
    'está',
    'estão',
    'ser',
    'foi',
    'foram',
    'tem',
    'têm',
    'há',
    'mais',
    'menos',
    'muito',
    'pouco',
    'isso',
    'isto',
    'aquilo',
    'já',
  ]);

  async grade(input: GradingInput): Promise<GradingOutcome> {
    // O arquivo entregue conta junto com o relato: um .docx com o documento
    // pronto é evidência tão legítima quanto a descrição escrita.
    const words = this.tokenize(`${input.notes} ${input.attachmentText}`);
    const present = new Set(words);

    const criteria = input.rubric.criteria.map((criterion) => {
      const terms = this.tokenize(`${criterion.title} ${criterion.whatToObserve}`);
      const unique = [...new Set(terms)];
      const matched = unique.filter((term) => present.has(term));

      // Cobertura de termos, convertida em nota de 0 a 100.
      const coverage = unique.length === 0 ? 0 : matched.length / unique.length;
      const score = Math.min(100, Math.round(coverage * 140));

      return {
        criterionId: criterion.id,
        score,
        comment:
          score >= 70
            ? 'O relato trata deste critério.'
            : 'O relato quase não fala sobre este critério. Descreva o que você fez aqui.',
      };
    });

    const weakest = criteria.filter((c) => c.score < 70);
    const average = criteria.reduce((sum, c) => sum + c.score, 0) / (criteria.length || 1);

    return {
      criteria,
      strengths:
        weakest.length === 0
          ? ['O relato menciona todos os critérios pedidos.']
          : ['O relato foi entregue e já cobre parte dos critérios.'],
      improvements: weakest.map((c) => {
        const criterion = input.rubric.criteria.find((item) => item.id === c.criterionId);
        return `Detalhe melhor: ${criterion?.title ?? c.criterionId}.`;
      }),
      // Falha crítica exige interpretação; esta verificação não a detecta.
      criticalFailureIndexes: [],
      /*
       * Só assume a decisão nos extremos: relato que cobre tudo, ou relato
       * que quase não cobre nada. No meio, quem decide é uma pessoa.
       */
      confident: average >= 85 || average < 40,
      model: null,
    };
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 3 && !RulesActivityGrader.STOPWORDS.has(word));
  }
}
