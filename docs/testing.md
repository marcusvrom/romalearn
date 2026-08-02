# Testes

## Estratégia

| Camada                  | O que cobre                                                                | Onde                          |
| ----------------------- | -------------------------------------------------------------------------- | ----------------------------- |
| Unitários               | Regras puras: conclusão de aula, preço, sanitização, assinatura de webhook | `apps/api/src/**/*.spec.ts`   |
| Integração e end-to-end | Fluxos completos contra a aplicação real e um PostgreSQL real              | `apps/api/test/*.e2e-spec.ts` |

Os testes end-to-end sobem a aplicação inteira (mesmos guards, pipes e filtros da produção) e
falam com um banco de verdade. Nada é substituído por mock nos caminhos críticos: se o teste
passa, o fluxo funciona.

## Executando

```bash
pnpm test       # unitários (não precisam de banco)
pnpm test:e2e   # integração e end-to-end (exigem PostgreSQL)
```

### Preparando o banco de testes

Com Docker, o `docker-compose` já cria `romalearn_test` no primeiro boot. Manualmente:

```bash
createdb -h localhost -U romalearn romalearn_test
```

O nome do banco vem de `POSTGRES_TEST_DB`. Cada arquivo de teste recria o schema do zero e
reaplica as migrations, então a suíte é independente da ordem de execução.

Os testes forçam `MAIL_DRIVER=console`, `STORAGE_DRIVER=local` e `PAYMENT_GATEWAY=fake`: nenhum
e-mail sai da máquina e nenhuma cobrança real acontece.

## Cobertura dos fluxos obrigatórios

### `auth.e2e-spec.ts`

- cadastro com registro do aceite dos termos e envio da confirmação;
- recusa de e-mail duplicado, senha fraca e falta de aceite;
- login correto e incorreto — com resposta idêntica para senha errada e e-mail inexistente;
- bloqueio de conta suspensa;
- cookies `HttpOnly` de sessão;
- rotação de refresh token e invalidação da família ao detectar reuso;
- logout;
- confirmação de e-mail com token de uso único;
- recuperação de senha sem revelar se o e-mail existe;
- redefinição de senha encerrando as sessões abertas;
- alteração de perfil e de senha;
- autorização por papel: aluno recusado no painel, administrador liberado, gestor de conteúdo
  recusado em ações financeiras.

### `learning-journey.e2e-spec.ts` — fluxo vertical completo

`cadastro → matrícula → consumo de aulas → questionário → conclusão → certificado → validação
pública`

- catálogo público lista só cursos publicados (o módulo 5 continua em rascunho);
- acesso negado ao player sem permissão;
- matrícula gratuita idempotente, recusada em curso pago;
- abrir a página **não** conclui a aula;
- limite de 120 segundos por batida de progresso;
- retomada da posição do vídeo;
- registro da última aula acessada;
- gabarito não é entregue antes do envio da tentativa;
- reprovação abaixo da nota mínima e aprovação com conclusão automática da aula;
- histórico de tentativas;
- conclusão do curso quando todos os critérios são atendidos;
- emissão de **exatamente um** certificado, sem duplicar ao reprocessar a conclusão;
- geração do PDF (verificando a assinatura `%PDF`);
- outro aluno não baixa o certificado alheio;
- validação pública sem expor dados pessoais;
- código inexistente devolve "inválido";
- revogação pelo administrador refletida imediatamente na validação.

### `commerce.e2e-spec.ts`

- oferta de teste identificada como sandbox;
- checkout exige autenticação e recusa campos extras enviados pelo cliente;
- pagamento nasce pendente, sem liberar acesso;
- webhook sem assinatura válida é recusado e nada muda;
- webhook com valor divergente não libera acesso;
- webhook assinado libera o acesso à trilha inteira;
- **webhook repetido não duplica** pedidos, matrículas nem permissões;
- pedido aprovado não regride por evento atrasado;
- compra bloqueada para quem já tem acesso;
- pagamento recusado não libera acesso;
- cupom criado pelo administrador aplica desconto; cupom inexistente é recusado;
- liberação manual de acesso com motivo auditado;
- revogação de acesso bloqueando o conteúdo novamente;
- reembolso revogando o acesso concedido pelo pedido;
- registro dos webhooks para auditoria.

## Resultado atual

```
Unitários:      4 suítes, 35 testes  — todos passando
End-to-end:     3 suítes, 64 testes  — todos passando
```

## Escrevendo novos testes

O helper `test/helpers/test-app.ts` sobe a aplicação e recria o schema;
`test/helpers/api-client.ts` embrulha o supertest com o prefixo, a autenticação e a assinatura de
webhooks.

```ts
const context = await createTestApp();
const api = new ApiClient(context.app);

const student = await api.register('aluno@exemplo.com');
await api.post('/commerce/enroll-free', { courseSlug: FREE_COURSE_SLUG }, student).expect(201);
```
