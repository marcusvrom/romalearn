import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WEB_ROUTES } from '@romalearn/contracts';
import { PLATFORM_CONFIG } from '../../core/platform.config';
import { SeoService } from '../../core/seo.service';

interface LegalSection {
  title: string;
  paragraphs: string[];
  items?: string[];
}

/**
 * Termos de Uso e Política de Privacidade.
 *
 * Texto-base operacional, descrevendo fielmente o que a plataforma faz.
 * Antes de ir ao ar, precisa de revisão jurídica e do preenchimento dos
 * dados institucionais (razão social, CNPJ e endereço).
 */
@Component({
  selector: 'rl-legal-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rl-container rl-container--narrow rl-section">
      <p class="rl-eyebrow">{{ isPrivacy() ? 'Privacidade' : 'Termos' }}</p>
      <h1>{{ title() }}</h1>
      <p class="rl-small rl-muted">Versão {{ version }} · Última atualização: janeiro de 2026.</p>

      <div class="notice">
        <strong>Documento em revisão.</strong> Este texto descreve o funcionamento atual da
        plataforma e ainda precisa de revisão jurídica e do preenchimento dos dados institucionais
        (razão social, CNPJ e endereço) antes da publicação definitiva.
      </div>

      @for (section of sections(); track section.title) {
        <section class="block">
          <h2>{{ section.title }}</h2>
          @for (paragraph of section.paragraphs; track paragraph) {
            <p class="rl-muted">{{ paragraph }}</p>
          }
          @if (section.items) {
            <ul>
              @for (item of section.items; track item) {
                <li class="rl-muted">{{ item }}</li>
              }
            </ul>
          }
        </section>
      }

      <p class="rl-small rl-muted">
        Dúvidas sobre este documento:
        <a [href]="'mailto:' + config.supportEmail">{{ config.supportEmail }}</a
        >.
      </p>
    </div>
  `,
  styles: [
    `
      .notice {
        padding: var(--rl-space-4);
        border-left: 4px solid var(--rl-warn-500);
        background: var(--rl-warn-100);
        color: var(--rl-warn-700);
        border-radius: var(--rl-radius-md);
        margin: var(--rl-space-6) 0 var(--rl-space-10);
        font-size: var(--rl-text-sm);
      }

      .block {
        margin-bottom: var(--rl-space-8);
      }

      .block h2 {
        font-size: var(--rl-text-xl);
      }

      ul {
        padding-left: var(--rl-space-6);
      }

      li {
        margin-bottom: var(--rl-space-2);
      }
    `,
  ],
})
export class LegalPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  readonly config = inject(PLATFORM_CONFIG);

  readonly version = '2026-01';
  private readonly document = signal<'terms' | 'privacy'>('terms');

  isPrivacy = () => this.document() === 'privacy';
  title = () => (this.isPrivacy() ? 'Política de Privacidade' : 'Termos de Uso');

  sections = (): LegalSection[] =>
    this.isPrivacy() ? this.privacySections() : this.termsSections();

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.document.set(data['document'] === 'privacy' ? 'privacy' : 'terms');

      this.seo.apply({
        title: this.title(),
        description: this.isPrivacy()
          ? 'Como tratamos os dados pessoais dos alunos da plataforma.'
          : 'Condições de uso da plataforma de cursos.',
        path: this.isPrivacy() ? WEB_ROUTES.privacy : WEB_ROUTES.terms,
      });
    });
  }

  private termsSections(): LegalSection[] {
    return [
      {
        title: '1. Sobre estes termos',
        paragraphs: [
          `Estes Termos regulam o uso da plataforma ${this.config.name}, operada por ${this.config.legalName}. Ao criar uma conta, você declara que leu e concorda com este documento e com a Política de Privacidade.`,
          'Registramos a versão dos termos aceita por você e a data do aceite. Quando houver mudança relevante, uma nova versão será publicada e o aceite será solicitado novamente.',
        ],
      },
      {
        title: '2. Conta e acesso',
        paragraphs: [
          'A conta é pessoal e intransferível. Você é responsável por manter sua senha em sigilo e por todas as atividades realizadas com suas credenciais.',
          'Menores de idade devem usar a plataforma com acompanhamento de um responsável, especialmente nas atividades que envolvem redes sociais e publicação de informações.',
        ],
      },
      {
        title: '3. Conteúdo e licença de uso',
        paragraphs: [
          'Os cursos, e-books, atividades e questionários são protegidos por direitos autorais. Ao adquirir ou se matricular, você recebe uma licença pessoal, não exclusiva e intransferível para estudo.',
          'Não é permitido copiar, redistribuir, revender, publicar ou compartilhar credenciais e materiais com terceiros.',
        ],
      },
      {
        title: '4. Compras, acesso e reembolso',
        paragraphs: [
          'O acesso ao conteúdo pago é liberado somente após a confirmação do pagamento pelo provedor. O valor cobrado é sempre o da oferta vigente registrada na plataforma.',
          'Conforme o Código de Defesa do Consumidor, você pode desistir da compra em até 7 dias corridos a partir da contratação. Nesse caso, o valor é devolvido e o acesso ao conteúdo é encerrado.',
        ],
      },
      {
        title: '5. Certificados',
        paragraphs: [
          'O certificado é emitido apenas quando todos os critérios de conclusão do curso são atendidos, verificados automaticamente pela plataforma.',
          'O certificado atesta a conclusão do curso e sua carga horária. Ele não é um diploma, não substitui formação regulamentada e não garante emprego, promoção ou aprovação em processo seletivo.',
          'Certificados podem ser revogados em caso de fraude, uso indevido da conta ou erro de emissão. A revogação fica visível na página pública de validação.',
        ],
      },
      {
        title: '6. Uso aceitável',
        paragraphs: ['É proibido usar a plataforma para:'],
        items: [
          'compartilhar a conta ou o conteúdo com terceiros;',
          'tentar burlar controles de acesso, pagamento ou de progresso;',
          'enviar conteúdo ilegal, ofensivo ou dados pessoais de terceiros nas atividades;',
          'automatizar acessos de forma a prejudicar o funcionamento do serviço.',
        ],
      },
      {
        title: '7. Disponibilidade e alterações',
        paragraphs: [
          'Buscamos manter o serviço disponível, mas podem ocorrer interrupções para manutenção ou por fatores fora do nosso controle.',
          'Podemos aprimorar, corrigir e atualizar o conteúdo dos cursos. Correções e melhorias ficam disponíveis para quem já tem acesso, sem custo adicional.',
        ],
      },
      {
        title: '8. Encerramento da conta',
        paragraphs: [
          'Você pode solicitar o encerramento da sua conta a qualquer momento pelo canal de suporte. Podemos suspender contas que descumpram estes Termos, com aviso sempre que possível.',
        ],
      },
      {
        title: '9. Foro e contato',
        paragraphs: [
          `Estes Termos são regidos pela legislação brasileira. Para dúvidas, escreva para ${this.config.supportEmail}.`,
        ],
      },
    ];
  }

  private privacySections(): LegalSection[] {
    return [
      {
        title: '1. Quem trata seus dados',
        paragraphs: [
          `Os dados pessoais coletados nesta plataforma são tratados por ${this.config.legalName}, na condição de controladora, conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018).`,
        ],
      },
      {
        title: '2. Quais dados coletamos',
        paragraphs: [
          'Coletamos apenas o necessário para o serviço funcionar (minimização de dados):',
        ],
        items: [
          'Cadastro: nome, e-mail e, opcionalmente, telefone.',
          'Segurança: hash da senha (nunca a senha em si), registro de acessos e endereço IP.',
          'Aprendizagem: progresso nas aulas, respostas de questionários e envios de atividades.',
          'Compras: pedidos, pagamentos e situação da transação. Dados de cartão são processados diretamente pelo provedor de pagamento e não chegam aos nossos servidores.',
          'Certificados: nome, curso, carga horária e datas registrados no momento da emissão.',
        ],
      },
      {
        title: '3. Para que usamos',
        paragraphs: [
          'Usamos os dados para criar e manter sua conta, liberar o conteúdo contratado, registrar seu progresso, emitir certificados, enviar e-mails do serviço, dar suporte, prevenir fraudes e cumprir obrigações legais.',
          'Não vendemos seus dados e não os usamos para publicidade de terceiros.',
        ],
      },
      {
        title: '4. Com quem compartilhamos',
        paragraphs: [
          'Compartilhamos dados apenas com operadores necessários para o serviço: provedor de pagamento, provedor de envio de e-mail e provedor de infraestrutura. Cada um recebe somente o necessário para sua função.',
        ],
      },
      {
        title: '5. O que aparece publicamente',
        paragraphs: [
          'A página pública de validação de certificado mostra apenas nome do aluno, curso, carga horária, datas, instituição emissora e situação do certificado. E-mail, telefone, CPF e identificadores internos nunca são exibidos.',
        ],
      },
      {
        title: '6. Por quanto tempo guardamos',
        paragraphs: [
          'Mantemos os dados enquanto sua conta existir. Registros fiscais e de certificados são mantidos pelos prazos exigidos por lei, mesmo após o encerramento da conta.',
        ],
      },
      {
        title: '7. Seus direitos',
        paragraphs: ['Você pode, a qualquer momento, solicitar:'],
        items: [
          'confirmação de que tratamos seus dados e acesso a eles;',
          'correção de dados incompletos ou desatualizados;',
          'anonimização, bloqueio ou eliminação de dados desnecessários;',
          'portabilidade dos dados;',
          'informações sobre com quem compartilhamos seus dados;',
          'revogação do consentimento, quando for essa a base legal.',
        ],
      },
      {
        title: '8. Exclusão e anonimização da conta',
        paragraphs: [
          `Para excluir sua conta, escreva para ${this.config.supportEmail} a partir do e-mail cadastrado. Confirmada a identidade, a conta é anonimizada em até 30 dias: nome, e-mail e telefone são substituídos por dados neutros e o acesso é encerrado.`,
          'Registros de pedidos, pagamentos e certificados emitidos são preservados de forma desvinculada da sua identidade, por exigência legal e para manter a validade pública dos certificados já emitidos.',
        ],
      },
      {
        title: '9. Segurança',
        paragraphs: [
          'Adotamos senhas protegidas com algoritmo de hash moderno, transmissão criptografada, cookies de sessão restritos, controle de acesso por papéis, limitação de tentativas e registro de auditoria das ações sensíveis.',
        ],
      },
      {
        title: '10. Contato do encarregado',
        paragraphs: [
          `Para exercer seus direitos ou tirar dúvidas sobre privacidade, escreva para ${this.config.supportEmail}.`,
        ],
      },
    ];
  }
}
