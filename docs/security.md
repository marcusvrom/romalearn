# Segurança e privacidade

## Autenticação

| Item              | Implementação                                                      |
| ----------------- | ------------------------------------------------------------------ |
| Senhas            | Argon2id (19 MiB, 2 iterações, 1 thread — recomendação da OWASP)   |
| Sessão            | Cookies `HttpOnly`, `SameSite`, `Secure` em produção               |
| Access token      | JWT de curta duração (15 min por padrão)                           |
| Refresh token     | Opaco, só o hash SHA-256 é persistido                              |
| Rotação           | A cada renovação; reuso de token antigo invalida a família inteira |
| Cookie de refresh | Restrito ao caminho `/api/auth`                                    |
| Troca de senha    | Encerra todas as sessões abertas                                   |

Login com e-mail inexistente verifica um hash descartável, para que o tempo de resposta seja o
mesmo de uma senha errada — não é possível descobrir quais e-mails estão cadastrados.

## Autorização

Papéis: `STUDENT`, `ADMIN`, `CONTENT_MANAGER`, `SUPPORT`. `ADMIN` acumula os demais.

O guard de autenticação é **global**: sem o decorador `@Public()`, toda rota exige sessão válida.
Rotas administrativas exigem papel, verificado no backend a cada requisição.

Esconder botões no front-end nunca é a proteção. Os testes cobrem explicitamente o acesso negado.

## Proteções de entrada

| Ameaça               | Proteção                                                                                                                                     |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| XSS                  | Conteúdo Markdown sanitizado no backend com allowlist de tags e atributos; `javascript:` e `data:` bloqueados; `iframe` e `script` removidos |
| SQL injection        | TypeORM com consultas parametrizadas; nenhuma interpolação de string em SQL                                                                  |
| CSRF                 | Cookies `SameSite`, CORS restritivo com allowlist e cookie de refresh de caminho restrito                                                    |
| Payload inesperado   | `ValidationPipe` com `whitelist` e `forbidNonWhitelisted` — campos extras são recusados                                                      |
| Upload indevido      | Allowlist de MIME por categoria, limite de tamanho, nome gerado pelo servidor (UUID)                                                         |
| Força bruta          | Rate limit global e limite menor nas rotas de credenciais                                                                                    |
| Enumeração de contas | Respostas idênticas em login, recuperação de senha e reenvio de confirmação                                                                  |

## Cabeçalhos e transporte

`helmet` na API (com HSTS em produção) e, no SSR, `X-Content-Type-Options`, `X-Frame-Options`,
`Referrer-Policy` e `Permissions-Policy`.

CORS aceita apenas as origens listadas em `CORS_ORIGINS`, com credenciais.

## Arquivos

Arquivos privados nunca são públicos: cada download recebe uma URL assinada e temporária
(15 minutos por padrão). No driver S3/MinIO isso usa presigned URLs; no driver local, um HMAC com
expiração verificado antes de servir o arquivo. O caminho é normalizado para impedir escapar do
diretório do storage.

## Pagamentos

- valores e ofertas vêm sempre do banco, nunca do cliente;
- webhooks só são aceitos com assinatura válida (HMAC de tempo constante);
- valor divergente do cobrado não libera acesso;
- dados de cartão não chegam ao servidor: a captura é do provedor;
- credenciais vêm exclusivamente do ambiente.

## Privacidade (LGPD)

### Minimização

Coletamos nome, e-mail e, opcionalmente, telefone. Não pedimos CPF, endereço nem data de
nascimento — nada disso é necessário para o serviço funcionar.

### Aceite versionado

Cada conta registra qual versão dos Termos e da Política de Privacidade foi aceita e quando.
Mudou a versão, novos cadastros registram a nova.

### Validação pública de certificado

A página pública mostra apenas nome do aluno, curso, carga horária, datas, instituição emissora e
situação. E-mail, telefone e identificadores internos **não** são expostos — a API sequer os envia.

### Exclusão e anonimização

Fluxo implementado em `UsersService.anonymize()` e disponível no painel:

1. o titular solicita a exclusão pelo e-mail de suporte, a partir do endereço cadastrado;
2. confirmada a identidade, um administrador executa a anonimização;
3. nome, e-mail e telefone são substituídos por dados neutros, a conta é marcada como
   `ANONYMIZED` e o acesso é encerrado;
4. registros de pedidos, pagamentos e certificados são preservados de forma desvinculada da
   identidade, por exigência legal e para manter válidos os certificados já emitidos.

A ação fica registrada na auditoria.

### Dados em log

Senha, hash, token, cookie, cabeçalho de autorização e dados de cartão nunca são registrados. A
função `redact()` substitui campos sensíveis por `[REDACTED]` antes de qualquer gravação.

## Conteúdo e honestidade

Decisões de produto com efeito sobre a confiança do usuário:

- não há depoimentos fictícios: a seção só aparece quando houver depoimentos reais habilitados
  nas configurações;
- não há contadores de alunos, urgência artificial ou preço "de" inventado;
- ofertas de teste são identificadas como sandbox na interface e recusadas em produção;
- o material declara explicitamente que não garante emprego, salário ou promoção;
- o Módulo 5 aparece como em produção, sem conteúdo inventado.

## Pendências antes de ir ao ar

- [ ] Revisão jurídica dos Termos de Uso e da Política de Privacidade
- [ ] Preencher razão social, CNPJ e endereço nas configurações
- [ ] Gerar segredos de produção (`JWT_*`, webhook)
- [ ] Configurar HTTPS com `COOKIE_SECURE=true`
- [ ] Credenciais de produção do provedor de pagamento
- [ ] Definir e testar a rotina de backup
