import { unzipSync } from 'fflate';
import type { ActivityAttachmentPolicyDto, AttachmentCheckDto } from '@romalearn/contracts';

/**
 * Inspeção do arquivo entregue pelo aluno.
 *
 * Um arquivo enviado por terceiro é a entrada mais perigosa da plataforma.
 * Aqui ele é tratado como dado hostil: nada é executado, nada é aberto por
 * biblioteca de escritório e o conteúdo só é lido para extrair texto.
 *
 * Três verificações, nesta ordem:
 *
 * 1. **Extensão declarada** contra a política da aula.
 * 2. **Assinatura real do arquivo** — renomear `virus.exe` para `.docx` não
 *    passa, porque os bytes iniciais não batem.
 * 3. **Estrutura interna**, no caso do OOXML: um `.docx` de verdade contém
 *    `word/document.xml`. Isso separa um documento do Word de um `.zip`
 *    qualquer com o nome trocado.
 *
 * A descompactação tem teto de tamanho e de número de itens: um "zip bomb"
 * de 1 MB pode expandir para gigabytes e derrubar o processo.
 */

/** Teto do conteúdo descompactado, independente do tamanho do arquivo. */
const MAX_UNZIPPED_BYTES = 40 * 1024 * 1024;

/** Teto de itens dentro do pacote. */
const MAX_ZIP_ENTRIES = 500;

/** Quanto de texto extraído é entregue à correção. */
const MAX_EXTRACTED_CHARS = 20000;

/** Parte principal que identifica cada formato do Office. */
const OOXML_MAIN_PART: Record<string, { part: string; label: string }> = {
  '.docx': { part: 'word/document.xml', label: 'documento do Word' },
  '.xlsx': { part: 'xl/workbook.xml', label: 'pasta de trabalho do Excel' },
  '.pptx': { part: 'ppt/presentation.xml', label: 'apresentação do PowerPoint' },
};

export interface InspectedAttachment {
  checks: AttachmentCheckDto[];
  /** Texto extraído para a correção. Vazio quando não foi possível ler. */
  text: string;
  /** Falso quando o arquivo deve ser recusado. */
  accepted: boolean;
  /** Motivo da recusa, pronto para exibição. */
  rejection: string | null;
}

export function inspectAttachment(
  buffer: Buffer,
  originalName: string,
  policy: ActivityAttachmentPolicyDto,
): InspectedAttachment {
  const checks: AttachmentCheckDto[] = [];
  const extension = extensionOf(originalName);

  // 1. Extensão aceita pela aula.
  const extensionOk = policy.extensions.includes(extension);
  checks.push({
    label: `Formato aceito (${policy.extensions.join(', ')})`,
    passed: extensionOk,
  });
  if (!extensionOk) {
    return reject(
      checks,
      `Esta atividade aceita apenas ${formatList(policy.extensions)}. Você enviou "${extension || 'um arquivo sem extensão'}".`,
    );
  }

  // 2. Tamanho.
  const sizeOk = buffer.length > 0 && buffer.length <= policy.maxBytes;
  checks.push({
    label: `Tamanho até ${formatBytes(policy.maxBytes)}`,
    passed: sizeOk,
  });
  if (!sizeOk) {
    return reject(
      checks,
      buffer.length === 0
        ? 'O arquivo está vazio.'
        : `O arquivo tem ${formatBytes(buffer.length)} e o limite é ${formatBytes(policy.maxBytes)}.`,
    );
  }

  // 3. Assinatura real dos bytes.
  const signatureOk = matchesSignature(buffer, extension);
  checks.push({ label: 'O conteúdo corresponde à extensão', passed: signatureOk });
  if (!signatureOk) {
    return reject(
      checks,
      `O conteúdo do arquivo não é um ${extension}. Trocar a extensão do nome não converte o formato — ` +
        'gere o arquivo pelo próprio programa.',
    );
  }

  // 4. Estrutura interna e extração do texto.
  const ooxml = OOXML_MAIN_PART[extension];
  if (ooxml) {
    const entries = readZip(buffer);
    if (!entries) {
      checks.push({ label: `É um ${ooxml.label} válido`, passed: false });
      return reject(checks, 'Não foi possível abrir o arquivo. Ele pode estar corrompido.');
    }

    const structureOk = ooxml.part in entries;
    checks.push({ label: `É um ${ooxml.label} válido`, passed: structureOk });
    if (!structureOk) {
      return reject(
        checks,
        `Este arquivo não é um ${ooxml.label}. Salve novamente pelo programa, no formato ${extension}.`,
      );
    }

    const text = extractOoxmlText(entries, extension);
    checks.push({ label: 'Conteúdo lido para a correção', passed: text.length > 0 });
    return { checks, text, accepted: true, rejection: null };
  }

  // Texto puro: csv e txt.
  const text = buffer.toString('utf8').slice(0, MAX_EXTRACTED_CHARS);
  checks.push({ label: 'Conteúdo lido para a correção', passed: text.trim().length > 0 });
  return { checks, text, accepted: true, rejection: null };
}

function reject(checks: AttachmentCheckDto[], rejection: string): InspectedAttachment {
  return { checks, text: '', accepted: false, rejection };
}

function extensionOf(name: string): string {
  const dot = name.lastIndexOf('.');
  return dot === -1 ? '' : name.slice(dot).toLowerCase();
}

/**
 * Confere os bytes iniciais do arquivo.
 *
 * Os formatos do Office são pacotes ZIP, então começam com "PK\x03\x04".
 */
function matchesSignature(buffer: Buffer, extension: string): boolean {
  const starts = (...bytes: number[]) => bytes.every((byte, index) => buffer[index] === byte);

  switch (extension) {
    case '.docx':
    case '.xlsx':
    case '.pptx':
      return starts(0x50, 0x4b, 0x03, 0x04);

    case '.pdf':
      return starts(0x25, 0x50, 0x44, 0x46); // %PDF

    case '.png':
      return starts(0x89, 0x50, 0x4e, 0x47);

    case '.jpg':
    case '.jpeg':
      return starts(0xff, 0xd8, 0xff);

    case '.csv':
    case '.txt':
      // Texto não tem assinatura: exigimos que seja decodificável e sem
      // bytes de controle típicos de binário.
      return isProbablyText(buffer);

    default:
      return false;
  }
}

function isProbablyText(buffer: Buffer): boolean {
  const amostra = buffer.subarray(0, 4096);
  for (const byte of amostra) {
    // Nulo ou controle fora de tab/CR/LF indica arquivo binário.
    if (byte === 0) return false;
    if (byte < 9 || (byte > 13 && byte < 32)) return false;
  }
  return true;
}

/** Descompacta com teto de itens e de tamanho, contra "zip bomb". */
function readZip(buffer: Buffer): Record<string, Uint8Array> | null {
  try {
    let total = 0;
    let count = 0;

    return unzipSync(new Uint8Array(buffer), {
      filter: (file) => {
        count += 1;
        total += file.originalSize;
        if (count > MAX_ZIP_ENTRIES || total > MAX_UNZIPPED_BYTES) {
          throw new Error('pacote além do limite aceito');
        }
        // Só as partes de texto interessam; mídia embutida é ignorada.
        return file.name.endsWith('.xml');
      },
    });
  } catch {
    return null;
  }
}

/** Junta o texto das partes XML relevantes de cada formato. */
function extractOoxmlText(entries: Record<string, Uint8Array>, extension: string): string {
  const nomes = Object.keys(entries);
  const decoder = new TextDecoder('utf-8');

  const relevantes =
    extension === '.docx'
      ? nomes.filter((n) => n === 'word/document.xml')
      : extension === '.xlsx'
        ? nomes.filter(
            (n) => n === 'xl/sharedStrings.xml' || /^xl\/worksheets\/sheet\d+\.xml$/.test(n),
          )
        : nomes.filter((n) => /^ppt\/(slides|notesSlides)\/\w+\d+\.xml$/.test(n));

  let texto = '';
  for (const nome of relevantes.sort()) {
    texto += ' ' + stripXml(decoder.decode(entries[nome]));
    if (texto.length > MAX_EXTRACTED_CHARS) break;
  }

  return texto.replace(/\s+/g, ' ').trim().slice(0, MAX_EXTRACTED_CHARS);
}

/**
 * Extrai o texto visível de uma parte XML.
 *
 * Não usa parser de XML de propósito: o objetivo é apenas ler caracteres,
 * e um parser completo abriria espaço para entidades externas e expansão
 * recursiva num arquivo que veio de fora.
 */
function stripXml(xml: string): string {
  return (
    xml
      // Quebras de parágrafo, linha e célula viram espaço para não colar palavras.
      .replace(/<\/(w:p|a:p|w:tr|row)>/g, ' ')
      .replace(/<[^>]*>/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
  );
}

function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${Math.round(bytes / (1024 * 1024))} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

function formatList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  return `${items.slice(0, -1).join(', ')} ou ${items[items.length - 1]}`;
}
