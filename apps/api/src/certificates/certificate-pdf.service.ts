import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import * as QRCode from 'qrcode';
import { Certificate } from './entities/certificate.entity';

const PALETTE = {
  ink: '#111827',
  muted: '#4b5563',
  brand: '#1d4ed8',
  accent: '#0ea5e9',
  border: '#cbd5f5',
  paper: '#ffffff',
};

function formatDate(value: Date | string): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'long',
    timeZone: 'America/Sao_Paulo',
  }).format(date);
}

/**
 * Geração do PDF do certificado.
 *
 * O conteúdo vem do snapshot imutável gravado na emissão — nunca dos dados
 * atuais do aluno ou do curso.
 */
@Injectable()
export class CertificatePdfService {
  async render(certificate: Certificate, verificationUrl: string): Promise<Buffer> {
    const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 320,
    });
    const qrCodeBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64');

    const document = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margins: { top: 48, bottom: 48, left: 56, right: 56 },
      info: {
        Title: `Certificado — ${certificate.snapshot.subjectTitle}`,
        Author: certificate.snapshot.issuerName,
        Subject: 'Certificado de conclusão',
      },
    });

    const chunks: Buffer[] = [];
    document.on('data', (chunk: Buffer) => chunks.push(chunk));

    const finished = new Promise<Buffer>((resolve, reject) => {
      document.on('end', () => resolve(Buffer.concat(chunks)));
      document.on('error', reject);
    });

    this.draw(document, certificate, verificationUrl, qrCodeBuffer);
    document.end();

    return finished;
  }

  private draw(
    doc: PDFKit.PDFDocument,
    certificate: Certificate,
    verificationUrl: string,
    qrCode: Buffer,
  ): void {
    const { width, height } = doc.page;
    const snapshot = certificate.snapshot;

    // Fundo e moldura.
    doc.rect(0, 0, width, height).fill(PALETTE.paper);
    doc
      .lineWidth(3)
      .strokeColor(PALETTE.brand)
      .roundedRect(24, 24, width - 48, height - 48, 12)
      .stroke();
    doc
      .lineWidth(1)
      .strokeColor(PALETTE.border)
      .roundedRect(36, 36, width - 72, height - 72, 8)
      .stroke();

    // Faixa superior com o emissor.
    doc.fillColor(PALETTE.brand).fontSize(13).font('Helvetica-Bold');
    doc.text(snapshot.issuerName.toUpperCase(), 56, 62, {
      width: width - 112,
      align: 'center',
      characterSpacing: 2,
    });

    doc.fillColor(PALETTE.ink).fontSize(34).font('Helvetica-Bold');
    doc.text('CERTIFICADO DE CONCLUSÃO', 56, 96, { width: width - 112, align: 'center' });

    doc.fillColor(PALETTE.muted).fontSize(12).font('Helvetica');
    doc.text('Certificamos que', 56, 156, { width: width - 112, align: 'center' });

    // Nome do aluno.
    doc.fillColor(PALETTE.ink).fontSize(30).font('Helvetica-Bold');
    doc.text(snapshot.studentName, 56, 180, { width: width - 112, align: 'center' });

    doc
      .moveTo(width / 2 - 180, 222)
      .lineTo(width / 2 + 180, 222)
      .lineWidth(1)
      .strokeColor(PALETTE.accent)
      .stroke();

    doc.fillColor(PALETTE.muted).fontSize(12).font('Helvetica');
    doc.text('concluiu com aproveitamento o curso', 56, 236, {
      width: width - 112,
      align: 'center',
    });

    doc.fillColor(PALETTE.brand).fontSize(20).font('Helvetica-Bold');
    doc.text(snapshot.subjectTitle, 56, 258, { width: width - 112, align: 'center' });

    doc.fillColor(PALETTE.muted).fontSize(12).font('Helvetica');
    doc.text(
      `com carga horária de ${snapshot.workloadHours} horas, ` +
        `concluído em ${formatDate(snapshot.completedAt)}.`,
      56,
      292,
      { width: width - 112, align: 'center' },
    );

    // Rodapé: dados de validação à esquerda, QR Code à direita.
    const footerTop = height - 190;

    doc.fillColor(PALETTE.ink).fontSize(10).font('Helvetica-Bold');
    doc.text('VALIDAÇÃO PÚBLICA', 72, footerTop);

    doc.fillColor(PALETTE.muted).fontSize(10).font('Helvetica');
    doc.text(`Código: ${certificate.verificationCode}`, 72, footerTop + 18);
    doc.text(`Emitido em: ${formatDate(snapshot.issuedAt)}`, 72, footerTop + 34);
    doc.text('Confira a autenticidade em:', 72, footerTop + 50);

    doc.fillColor(PALETTE.brand).fontSize(9);
    doc.text(verificationUrl, 72, footerTop + 66, {
      width: 320,
      link: verificationUrl,
      underline: false,
    });

    doc.image(qrCode, width - 190, footerTop - 6, { width: 110 });
    doc.fillColor(PALETTE.muted).fontSize(8).font('Helvetica');
    doc.text('Aponte a câmera para validar', width - 200, footerTop + 108, {
      width: 130,
      align: 'center',
    });

    // Assinatura institucional.
    doc
      .moveTo(72, height - 78)
      .lineTo(332, height - 78)
      .lineWidth(1)
      .strokeColor(PALETTE.border)
      .stroke();

    doc.fillColor(PALETTE.ink).fontSize(10).font('Helvetica-Bold');
    doc.text(snapshot.issuerLegalName, 72, height - 70, { width: 260 });
    doc.fillColor(PALETTE.muted).fontSize(9).font('Helvetica');
    doc.text('Instituição emissora', 72, height - 56, { width: 260 });
  }
}
