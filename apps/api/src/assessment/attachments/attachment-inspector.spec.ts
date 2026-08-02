import { zipSync, strToU8 } from 'fflate';
import type { ActivityAttachmentPolicyDto } from '@romalearn/contracts';
import { inspectAttachment } from './attachment-inspector';

const POLITICA_WORD: ActivityAttachmentPolicyDto = {
  required: true,
  maxBytes: 1024 * 1024,
  extensions: ['.docx'],
  hint: 'Envie o documento em .docx.',
};

const POLITICA_CSV: ActivityAttachmentPolicyDto = {
  required: false,
  maxBytes: 1024,
  extensions: ['.csv'],
  hint: 'Envie os dados em .csv.',
};

/** Monta um .docx mínimo mas legítimo: um ZIP com word/document.xml. */
function docx(texto: string): Buffer {
  return Buffer.from(
    zipSync({
      '[Content_Types].xml': strToU8('<Types/>'),
      'word/document.xml': strToU8(
        `<w:document><w:body><w:p><w:r><w:t>${texto}</w:t></w:r></w:p></w:body></w:document>`,
      ),
    }),
  );
}

describe('inspectAttachment', () => {
  it('aceita um .docx legítimo e extrai o texto', () => {
    const resultado = inspectAttachment(
      docx('Relatório de homologação de fornecedores'),
      'entrega.docx',
      POLITICA_WORD,
    );

    expect(resultado.accepted).toBe(true);
    expect(resultado.text).toContain('homologação de fornecedores');
    expect(resultado.checks.every((c) => c.passed)).toBe(true);
  });

  it('recusa extensão fora da política da aula', () => {
    const resultado = inspectAttachment(docx('x'), 'entrega.xlsx', POLITICA_WORD);

    expect(resultado.accepted).toBe(false);
    expect(resultado.rejection).toContain('.docx');
  });

  it('recusa arquivo acima do limite', () => {
    const grande = Buffer.alloc(2048, 0x61);
    const resultado = inspectAttachment(grande, 'dados.csv', POLITICA_CSV);

    expect(resultado.accepted).toBe(false);
    expect(resultado.rejection).toContain('limite');
  });

  it('recusa arquivo vazio', () => {
    const resultado = inspectAttachment(Buffer.alloc(0), 'dados.csv', POLITICA_CSV);

    expect(resultado.accepted).toBe(false);
    expect(resultado.rejection).toContain('vazio');
  });

  it('recusa executável renomeado para .docx', () => {
    // Cabeçalho de um executável do Windows.
    const executavel = Buffer.from([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00]);
    const resultado = inspectAttachment(executavel, 'virus.docx', POLITICA_WORD);

    expect(resultado.accepted).toBe(false);
    expect(resultado.rejection).toContain('não é um .docx');
  });

  it('recusa um .zip qualquer renomeado para .docx', () => {
    // É um ZIP de verdade, mas não tem a parte que define um documento do Word.
    const zipQualquer = Buffer.from(zipSync({ 'leiame.txt': strToU8('nada aqui') }));
    const resultado = inspectAttachment(zipQualquer, 'entrega.docx', POLITICA_WORD);

    expect(resultado.accepted).toBe(false);
    expect(resultado.rejection).toContain('documento do Word');
  });

  it('recusa binário disfarçado de csv', () => {
    const binario = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04]);
    const resultado = inspectAttachment(binario, 'dados.csv', POLITICA_CSV);

    expect(resultado.accepted).toBe(false);
  });

  it('aceita csv e devolve o conteúdo para a correção', () => {
    const csv = Buffer.from('Item;Quantidade\nCaneta;10\n', 'utf8');
    const resultado = inspectAttachment(csv, 'controle.csv', POLITICA_CSV);

    expect(resultado.accepted).toBe(true);
    expect(resultado.text).toContain('Caneta');
  });

  it('não expande um pacote com conteúdo além do limite', () => {
    // Um único item que se declara com centenas de megabytes uma vez
    // descompactado: o teto precisa impedir a expansão.
    const bomba = Buffer.from(
      zipSync({
        '[Content_Types].xml': strToU8('<Types/>'),
        'word/document.xml': strToU8('<w:t>' + 'a'.repeat(60 * 1024 * 1024) + '</w:t>'),
      }),
    );

    const resultado = inspectAttachment(bomba, 'entrega.docx', POLITICA_WORD);

    expect(resultado.accepted).toBe(false);
  });

  it('separa palavras de parágrafos diferentes ao extrair o texto', () => {
    const arquivo = Buffer.from(
      zipSync({
        '[Content_Types].xml': strToU8('<Types/>'),
        'word/document.xml': strToU8(
          '<w:body><w:p><w:t>primeiro</w:t></w:p><w:p><w:t>segundo</w:t></w:p></w:body>',
        ),
      }),
    );

    const resultado = inspectAttachment(arquivo, 'entrega.docx', POLITICA_WORD);

    expect(resultado.text).toContain('primeiro segundo');
    expect(resultado.text).not.toContain('primeirosegundo');
  });
});
