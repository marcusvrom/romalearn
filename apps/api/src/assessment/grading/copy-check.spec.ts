import { copiedRatio, looksCopied } from './copy-check';

const EXEMPLO =
  'Criei a estrutura Viagens 2026 03_Marco e dentro dela tres pastas Fotos Comprovantes e ' +
  'Temporarios. Renomeei os arquivos seguindo data assunto e versao. Copiei o roteiro em branco ' +
  'antes de preencher para nao perder o modelo. Abri o PDF e conferi as duas paginas.';

describe('copy-check', () => {
  it('acusa a cópia literal do exemplo', () => {
    expect(looksCopied(EXEMPLO, EXEMPLO)).toBe(true);
  });

  it('acusa cópia com pequenas trocas de palavra', () => {
    const disfarcado = EXEMPLO.replace('Viagens', 'Passeios').replace('duas', 'três');

    expect(looksCopied(disfarcado, EXEMPLO)).toBe(true);
  });

  it('acusa quem cola o exemplo e escreve mais um parágrafo por cima', () => {
    const colado = `${EXEMPLO}\n\nAlém disso, fiz tudo com muito cuidado e revisei no final.`;

    expect(looksCopied(colado, EXEMPLO)).toBe(true);
  });

  it('não acusa um relato original sobre o mesmo assunto', () => {
    const original =
      'Organizei minhas notas fiscais em uma pasta por mês. Coloquei a data no começo do nome de ' +
      'cada arquivo para ficarem em ordem. Guardei o modelo separado e trabalhei sempre em uma ' +
      'cópia. No fim gerei o PDF e li página por página antes de mandar para o contador.';

    expect(looksCopied(original, EXEMPLO)).toBe(false);
  });

  it('não acusa quando a aula não tem exemplo cadastrado', () => {
    expect(looksCopied(EXEMPLO, null)).toBe(false);
    expect(looksCopied(EXEMPLO, undefined)).toBe(false);
  });

  it('ignora acentuação e pontuação na comparação', () => {
    const comAcento = 'Não perdi o modelo, e conferi as páginas!';
    const semAcento = 'nao perdi o modelo e conferi as paginas';

    expect(copiedRatio(comAcento, semAcento)).toBeGreaterThan(0.9);
  });

  it('devolve zero quando não há exemplo com que comparar', () => {
    expect(copiedRatio('qualquer texto do aluno', '')).toBe(0);
  });
});
