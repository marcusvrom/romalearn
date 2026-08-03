import { Controller, Get, Header, Param, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CertificateDto, CertificateVerificationDto, UserRole } from '@romalearn/contracts';
import { Response } from 'express';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { CertificatesService } from './certificates.service';

@ApiTags('Certificados')
@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Get()
  @ApiOperation({ summary: 'Certificados do aluno autenticado.' })
  list(@CurrentUser('id') userId: string): Promise<CertificateDto[]> {
    return this.certificatesService.listForUser(userId);
  }

  /**
   * Página pública de validação — sem autenticação, por definição.
   * Devolve somente os dados necessários para conferir a autenticidade.
   */
  @Public()
  @Get('verify/:code')
  @ApiOperation({ summary: 'Valida publicamente um certificado pelo código.' })
  verify(@Param('code') code: string): Promise<CertificateVerificationDto> {
    return this.certificatesService.verify(code);
  }

  @Get(':id/pdf')
  @Header('Content-Type', 'application/pdf')
  @ApiOperation({ summary: 'Baixa o PDF do certificado.' })
  async pdf(
    @Param('id') id: string,
    @CurrentUser() user: { id: string; roles: UserRole[] },
    @Res() response: Response,
  ): Promise<void> {
    const isStaff = (user.roles ?? []).some((role) => role !== UserRole.STUDENT);
    const buffer = await this.certificatesService.pdfFor(id, user.id, isStaff);
    const certificate = await this.certificatesService.findOrFail(id);

    response.setHeader(
      'Content-Disposition',
      `attachment; filename="certificado-${certificate.verificationCode}.pdf"`,
    );
    response.setHeader('Content-Length', buffer.length);
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.end(buffer);
  }
}
