export type SupportTopicId =
  | 'ACCESS'
  | 'PAYMENT'
  | 'COURSE'
  | 'CERTIFICATE'
  | 'AUDIO'
  | 'TECHNICAL'
  | 'OTHER';

export interface SupportQuickAnswer {
  id: string;
  label: string;
  answer: string;
  actionLabel?: string;
  actionRoute?: string;
  escalate?: boolean;
}

export interface SupportTopic {
  id: SupportTopicId;
  icon: string;
  label: string;
  description: string;
  answers: SupportQuickAnswer[];
}

export const SUPPORT_TOPICS: SupportTopic[] = [
  {
    id: 'ACCESS',
    icon: '🔐',
    label: 'Acesso e senha',
    description: 'Login, senha, conta bloqueada ou curso que não aparece.',
    answers: [
      {
        id: 'forgot-password',
        label: 'Esqueci minha senha',
        answer:
          'Use a opção “Esqueci minha senha” na tela de entrada. Enviaremos um link para o e-mail cadastrado. Confira também spam e lixo eletrônico.',
        actionLabel: 'Recuperar senha',
        actionRoute: '/recuperar-senha',
      },
      {
        id: 'course-missing',
        label: 'Meu curso não aparece',
        answer:
          'Primeiro, confirme se entrou com o mesmo e-mail usado na compra. Pagamentos por Pix costumam liberar o acesso após a confirmação do gateway. Se o pagamento já estiver aprovado e o curso continuar ausente, envie o comprovante ao atendimento.',
        actionLabel: 'Ver meus cursos',
        actionRoute: '/painel',
        escalate: true,
      },
    ],
  },
  {
    id: 'PAYMENT',
    icon: '💳',
    label: 'Pagamento e compra',
    description: 'Pix, cartão, parcelamento, cobrança e reembolso.',
    answers: [
      {
        id: 'pix-pending',
        label: 'Paguei por Pix e está pendente',
        answer:
          'A confirmação normalmente ocorre em poucos minutos. Atualize o painel e confira se o pagamento saiu da sua conta. Se continuar pendente após um período razoável, envie o comprovante e o e-mail usado na compra.',
        escalate: true,
      },
      {
        id: 'card-declined',
        label: 'Meu cartão foi recusado',
        answer:
          'A recusa é informada pelo emissor do cartão. Confirme limite, dados digitados e autorização para compras online. Você também pode tentar outro cartão ou Pix. A RomaLearn não recebe o motivo bancário detalhado da recusa.',
      },
      {
        id: 'refund',
        label: 'Quero solicitar reembolso',
        answer:
          'A solicitação será analisada conforme os termos da compra e o prazo aplicável. Para agilizar, informe o curso, o e-mail da compra e o motivo da solicitação.',
        escalate: true,
      },
    ],
  },
  {
    id: 'COURSE',
    icon: '📚',
    label: 'Cursos e atividades',
    description: 'Progresso, aulas, exercícios, materiais e avaliações.',
    answers: [
      {
        id: 'progress-not-updated',
        label: 'Meu progresso não atualizou',
        answer:
          'Algumas aulas exigem tempo mínimo, atividade, questionário ou percentual de vídeo. Confira os requisitos mostrados na própria aula. Atualize a página após concluir a etapa pendente.',
        actionLabel: 'Abrir painel',
        actionRoute: '/painel',
      },
      {
        id: 'activity-help',
        label: 'Tenho dúvida em uma atividade',
        answer:
          'Revise o enunciado, os critérios de avaliação e os exemplos da aula. Ao solicitar ajuda humana, descreva o que tentou e em qual passo ficou com dúvida; isso permite uma resposta mais rápida e útil.',
        escalate: true,
      },
    ],
  },
  {
    id: 'CERTIFICATE',
    icon: '🎓',
    label: 'Certificados',
    description: 'Emissão, download, validação e dados incorretos.',
    answers: [
      {
        id: 'certificate-unavailable',
        label: 'Meu certificado não está disponível',
        answer:
          'O certificado é liberado quando todos os critérios do curso são concluídos. Confira aulas, atividades e questionários pendentes. Depois, acesse a seção de cursos concluídos no painel.',
        actionLabel: 'Ver painel',
        actionRoute: '/painel',
      },
      {
        id: 'certificate-data',
        label: 'Meu nome está incorreto',
        answer:
          'O nome do certificado usa os dados do perfil. Corrija seu nome antes de emitir um novo certificado. Se o documento já tiver sido emitido e não puder ser atualizado, acione o atendimento.',
        escalate: true,
      },
    ],
  },
  {
    id: 'AUDIO',
    icon: '🔊',
    label: 'Áudio das aulas',
    description: 'Voz, velocidade, reprodução e compatibilidade.',
    answers: [
      {
        id: 'audio-not-playing',
        label: 'O áudio não inicia',
        answer:
          'A narração usa as vozes disponíveis no dispositivo. Verifique o volume, tente outra voz no player e confirme se o navegador permite reprodução de áudio. Chrome, Edge, Safari e navegadores Android atualizados oferecem melhor compatibilidade.',
      },
      {
        id: 'audio-voice',
        label: 'Quero trocar voz ou velocidade',
        answer:
          'Use os controles do modo áudio. A velocidade Focado, de 1,75x, é o padrão recomendado, mas sua escolha fica salva no dispositivo.',
      },
    ],
  },
  {
    id: 'TECHNICAL',
    icon: '🛠️',
    label: 'Problema técnico',
    description: 'Erro, tela travada, upload ou comportamento inesperado.',
    answers: [
      {
        id: 'basic-troubleshooting',
        label: 'A página está com erro',
        answer:
          'Atualize a página, confirme sua conexão e tente uma janela anônima. Se o erro continuar, informe o endereço da página, o que estava fazendo, aparelho, navegador e, se possível, uma captura de tela.',
        escalate: true,
      },
    ],
  },
  {
    id: 'OTHER',
    icon: '💬',
    label: 'Outro assunto',
    description: 'Algo que não se encaixa nas opções anteriores.',
    answers: [
      {
        id: 'human-support',
        label: 'Falar com atendimento',
        answer:
          'Vamos encaminhar sua solicitação. Para reduzir o tempo de resposta, explique o problema, informe o curso relacionado e descreva o que já tentou.',
        escalate: true,
      },
    ],
  },
];
