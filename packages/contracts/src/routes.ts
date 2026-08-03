/**
 * Rotas públicas do site e caminhos da API em um único lugar, para que
 * front-end, e-mails e QR Codes não espalhem strings duplicadas.
 */

export const WEB_ROUTES = {
  home: '/',
  catalog: '/cursos',
  course: (slug: string) => `/cursos/${slug}`,
  program: (slug: string) => `/trilhas/${slug}`,
  login: '/entrar',
  register: '/criar-conta',
  forgotPassword: '/recuperar-senha',
  resetPassword: '/redefinir-senha',
  verifyEmail: '/confirmar-email',
  dashboard: '/painel',
  player: (courseSlug: string) => `/painel/cursos/${courseSlug}`,
  playerLesson: (courseSlug: string, lessonSlug: string) =>
    `/painel/cursos/${courseSlug}/aulas/${lessonSlug}`,
  certificates: '/painel/certificados',
  purchases: '/painel/compras',
  profile: '/painel/perfil',
  checkout: (offerId: string) => `/checkout/${offerId}`,
  certificateVerification: (code: string) => `/certificados/verificar/${code}`,
  terms: '/termos',
  privacy: '/privacidade',
  support: '/suporte',
  admin: '/admin',
} as const;

export const API_ROUTES = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
    verifyEmail: '/auth/verify-email',
    resendVerification: '/auth/resend-verification',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
  catalog: {
    courses: '/catalog/courses',
    course: (slug: string) => `/catalog/courses/${slug}`,
    programs: '/catalog/programs',
    program: (slug: string) => `/catalog/programs/${slug}`,
  },
  learning: {
    myCourses: '/learning/courses',
    player: (courseSlug: string) => `/learning/courses/${courseSlug}/player`,
    lesson: (courseSlug: string, lessonSlug: string) =>
      `/learning/courses/${courseSlug}/lessons/${lessonSlug}`,
    heartbeat: (lessonId: string) => `/learning/lessons/${lessonId}/progress`,
    complete: (lessonId: string) => `/learning/lessons/${lessonId}/complete`,
    submitQuiz: (quizId: string) => `/learning/quizzes/${quizId}/attempts`,
    submitActivity: (lessonId: string) => `/learning/lessons/${lessonId}/activity`,
  },
  commerce: {
    enrollFree: '/commerce/enroll-free',
    checkout: '/commerce/checkout',
    orders: '/commerce/orders',
    validateCoupon: '/commerce/coupons/validate',
    webhook: (gateway: string) => `/commerce/webhooks/${gateway}`,
  },
  certificates: {
    mine: '/certificates',
    pdf: (id: string) => `/certificates/${id}/pdf`,
    verify: (code: string) => `/certificates/verify/${code}`,
  },
  health: {
    live: '/health/live',
    ready: '/health/ready',
  },
} as const;

/** Prefixo de todas as rotas administrativas — protegidas por papel no backend. */
export const ADMIN_API_PREFIX = '/admin';
