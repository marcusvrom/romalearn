# Roteiro de testes manuais

Guia completo para colocar a plataforma no ar em uma máquina nova e testar
todos os cenários, um a um.

Tempo estimado: **15 minutos** de instalação + **40 minutos** para percorrer todos os roteiros.

---

## Parte 1 — Preparar a máquina

### 1.1 Instalar as ferramentas

Você precisa de três coisas: **Git**, **Node.js 22** e **Docker**.

#### macOS

```bash
# Homebrew (pule se já tiver)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

brew install git node@22
brew install --cask docker    # abra o Docker Desktop depois de instalar
corepack enable               # habilita o pnpm
```

#### Linux (Ubuntu/Debian)

```bash
sudo apt update && sudo apt install -y git curl ca-certificates

# Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
sudo corepack enable

# Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker "$USER"   # saia e entre de novo para valer
```

#### Windows

Use o **WSL2** com Ubuntu e siga as instruções do Linux acima. É o caminho com menos atrito.

```powershell
wsl --install -d Ubuntu
```

Instale também o **Docker Desktop** com a integração WSL2 ativada.

### 1.2 Conferir as versões

```bash
git --version      # qualquer versão recente
node --version     # precisa ser v22 ou superior
pnpm --version     # 10 ou superior
docker --version   # qualquer versão recente
```

Se `pnpm` não for encontrado:

```bash
corepack enable && corepack prepare pnpm@10.33.0 --activate
```

---

## Parte 2 — Subir o projeto

### 2.1 Clonar e instalar

```bash
git clone <url-do-repositorio> romalearn
cd romalearn
git checkout claude/romalearn-platform-courses-hjaq3w

pnpm install
```

### 2.2 Configurar

```bash
cp .env.example .env
```

Para testar localmente **não é preciso mudar nada** no `.env`. Os valores padrão já apontam para
os serviços que o Docker vai subir.

### 2.3 Subir banco, armazenamento e caixa de e-mail

```bash
pnpm infra:up
```

Isso sobe três contêineres:

| Contêiner  | Para quê                   | Endereço              |
| ---------- | -------------------------- | --------------------- |
| PostgreSQL | Banco de dados             | `localhost:5432`      |
| MinIO      | Arquivos (materiais, PDFs) | http://localhost:9001 |
| Mailpit    | Caixa de e-mail local      | http://localhost:8025 |

Confira se subiram:

```bash
docker ps --format "table {{.Names}}\t{{.Status}}"
```

Espere ver `romalearn-postgres`, `romalearn-minio` e `romalearn-mailpit` como `Up`.

### 2.4 Preparar o banco e os dados de teste

```bash
pnpm --filter @romalearn/contracts build   # tipos compartilhados
pnpm seed:all                              # migrations + cursos + contas de teste
```

O `seed:all` faz duas coisas:

1. **`pnpm seed`** — cria as tabelas, os 6 cursos (extraídos dos e-books), a trilha, as ofertas e
   o administrador;
2. **`pnpm seed:demo`** — cria as 11 contas de teste, passando pelos fluxos reais de matrícula,
   estudo, compra e certificação.

Ao final, o terminal imprime a **tabela de contas com as senhas**. Guarde essa saída.

> As contas de demonstração são criadas apenas fora de produção. Em produção o comando se recusa
> a rodar.

### 2.5 Subir a aplicação

```bash
pnpm dev
```

Deixe rodando. Vai subir a API na `3333` e o site na `4200`.

### 2.6 Checklist de verificação

Abra em outra aba do terminal:

```bash
curl -s http://localhost:3333/api/health/ready     # deve responder {"status":"ok"...}
curl -s http://localhost:3333/api/catalog/courses | head -c 120
```

E no navegador:

| Endereço                       | O que esperar                          |
| ------------------------------ | -------------------------------------- |
| http://localhost:4200          | Landing page com os módulos carregados |
| http://localhost:4200/cursos   | Catálogo com 5 cursos                  |
| http://localhost:3333/api/docs | Documentação Swagger da API            |
| http://localhost:8025          | Caixa de e-mail (vazia por enquanto)   |

Se tudo isso funcionar, o ambiente está pronto.

---

## Parte 3 — Contas de teste

Todas as contas abaixo usam a senha **`Senha@123456`**, exceto o administrador.

| Perfil                 | E-mail                        | Senha          | O que testar                               |
| ---------------------- | ----------------------------- | -------------- | ------------------------------------------ |
| **Visitante**          | _(não entre)_                 | —              | Navegação pública, SEO, bloqueios          |
| **Aluno novo**         | `novo@romalearn.local`        | `Senha@123456` | Aviso de e-mail não confirmado; sem cursos |
| **Matriculado**        | `matriculado@romalearn.local` | `Senha@123456` | Player com 0% de progresso                 |
| **Em progresso**       | `progresso@romalearn.local`   | `Senha@123456` | "Continuar estudando"; 2 de 10 aulas       |
| **Concluinte**         | `concluinte@romalearn.local`  | `Senha@123456` | Certificado ativo, PDF e QR Code           |
| **Cert. revogado**     | `revogado@romalearn.local`    | `Senha@123456` | Certificado revogado; download bloqueado   |
| **Comprou a trilha**   | `trilha@romalearn.local`      | `Senha@123456` | Acesso aos 5 módulos pagos                 |
| **Pagamento pendente** | `pendente@romalearn.local`    | `Senha@123456` | Pedido aguardando; sem acesso              |
| **Pagamento recusado** | `recusado@romalearn.local`    | `Senha@123456` | Pedido recusado; sem acesso                |
| **Conta suspensa**     | `suspenso@romalearn.local`    | `Senha@123456` | Login recusado com mensagem própria        |
| **Gestor de conteúdo** | `conteudo@romalearn.local`    | `Senha@123456` | Edita cursos, bloqueado no financeiro      |
| **Suporte**            | `suporte@romalearn.local`     | `Senha@123456` | Consulta e libera acesso manual            |
| **Administrador**      | `admin@romalearn.local`       | `Admin@123456` | Acesso total ao painel                     |

Para rever a lista a qualquer momento:

```bash
pnpm seed:demo    # é idempotente: reimprime sem recriar as contas
```

---

## Parte 4 — Roteiros de teste

### Roteiro 1 — Visitante (não cadastrado) · ~5 min

Abra uma **janela anônima** para garantir que não há sessão.

1. Acesse http://localhost:4200
2. Percorra a landing page até o rodapé. Confira:
   - hero, seção de competências digitais, módulo gratuito, cinco módulos;
   - benefícios, como funciona, atividades práticas, certificados;
   - tabela comparando gratuito × trilha completa;
   - perguntas frequentes (clique para abrir);
   - **não deve haver** depoimentos, número de alunos ou contagem regressiva.
3. Clique em **Ver todos os cursos** → filtre por _Gratuitos_ e _Trilha paga_.
4. Abra **Microsoft Excel para Administração**. Confira o conteúdo: 4 partes, com os capítulos do
   e-book.
5. Clique em **Comprar a trilha completa** → deve levar ao **login** (não ao checkout).
6. Volte e clique em **Fazer matrícula gratuita** no módulo gratuito → deve levar ao **cadastro**.
7. Teste o bloqueio direto: acesse http://localhost:4200/painel
   → deve redirecionar para a tela de entrada.
8. Rode o teste de SEO:
   ```bash
   curl -s http://localhost:4200/cursos/microsoft-excel-para-administracao | grep -E "<title>|og:title|canonical"
   curl -s http://localhost:4200/robots.txt
   curl -s http://localhost:4200/sitemap.xml | head -20
   ```
   O `robots.txt` deve bloquear `/painel` e `/admin`.

### Roteiro 2 — Cadastro e confirmação de e-mail · ~5 min

1. Acesse http://localhost:4200/criar-conta
2. Tente enviar com senha `123` → deve recusar com mensagem sobre 10 caracteres.
3. Tente enviar **sem** marcar o aceite dos termos → deve recusar.
4. Preencha corretamente (use um e-mail qualquer, ex.: `teste1@exemplo.com`) e envie.
5. Você entra direto na área do aluno, com um aviso de **e-mail não confirmado**.
6. Abra o **Mailpit** (http://localhost:8025) → deve haver um e-mail _"Confirme seu e-mail"_.
7. Clique no link do e-mail → a conta é confirmada.
8. Clique no mesmo link de novo → deve recusar (token de uso único).

### Roteiro 3 — Recuperação de senha · ~3 min

1. Saia da conta e acesse http://localhost:4200/recuperar-senha
2. Informe um e-mail **que não existe** → mensagem genérica de sucesso (não vaza cadastros).
3. Informe `matriculado@romalearn.local` → mesma mensagem.
4. No Mailpit, abra o e-mail e clique em **Criar nova senha**.
5. Defina `NovaSenha2026` e confirme.
6. Entre com a senha antiga → deve falhar. Entre com a nova → deve funcionar.

> Depois deste roteiro, a senha de `matriculado@` passa a ser `NovaSenha2026`.
> Para voltar ao estado original, veja a Parte 6 (resetar ambiente).

### Roteiro 4 — Matrícula gratuita e player · ~8 min

Entre como **`matriculado@romalearn.local`**.

1. A área do aluno mostra _Carreira Digital e Destaque Profissional_ com **0%**.
2. Clique em **Começar agora**.
3. No player, confira:
   - lateral com as 4 partes e as 10 aulas;
   - barra de progresso no topo;
   - botões **Aula anterior** / **Próxima aula**.
4. Clique em **Marcar como concluída** imediatamente
   → deve recusar: _"Continue nesta aula por pelo menos 10 minutos antes de concluir."_

   **Este é o teste mais importante da plataforma:** abrir a página não conclui a aula.

5. Vá até uma aula de **Atividade prática** (ex.: _Mapa de habilidades e primeira evidência_):
   - tente concluir sem enviar → recusa;
   - escreva um relato e clique em **Enviar atividade**;
   - agora **Marcar como concluída** funciona.
6. No celular (ou reduzindo a janela para menos de 1024px), confira que a lateral vira um painel
   que abre pelo botão ☰.
7. Feche o navegador, entre de novo e volte ao curso → o progresso continua salvo.

### Roteiro 5 — Questionário · ~5 min

Continue como **`matriculado@`** ou entre como **`progresso@romalearn.local`**.

1. Abra a aula **Questionário de conclusão** (última parte).
2. Confira que **não há indicação da resposta certa** antes de enviar.
3. Responda tudo errado de propósito e envie → nota abaixo de 70%, com aviso de reprovação e
   botão **Tentar de novo**.
4. Verifique o feedback: alternativas corretas destacadas e explicação de cada questão.
5. Tente novamente com as respostas certas → aprovado, e a aula é concluída **automaticamente**.
6. Volte ao topo do player → o progresso subiu.

<details>
<summary>Gabarito do questionário do módulo gratuito</summary>

1. _O que é letramento tecnológico?_ → **Usar ferramentas digitais com compreensão, segurança e
   senso crítico.**
2. _Diferença entre conhecer e ter proficiência_ → **Proficiência aparece com prática, repetição,
   compreensão e evidência.**
3. _Cuidados ao usar IA_ (múltipla) → **Usar apenas quando conseguir conferir a resposta** +
   **Manter fatos e decisões sob responsabilidade humana**
4. _O que o material se propõe a fazer_ → **Melhorar o preparo e a clareza profissional.**

</details>

### Roteiro 6 — Conclusão e certificado · ~5 min

Entre como **`concluinte@romalearn.local`** (já concluiu o curso).

1. A área do aluno mostra o curso em **Cursos concluídos**.
2. Clique em **Ver certificado** → um certificado ativo, com código de validação.
3. Clique em **Baixar PDF**. Confira no arquivo:
   - nome do aluno, curso e carga horária (8 horas);
   - datas de conclusão e emissão;
   - código de validação e **QR Code**.
4. Aponte a câmera do celular para o QR Code → abre a página pública de validação.
   (Se o celular não alcança seu `localhost`, copie a URL impressa abaixo do QR.)
5. Na página de validação, confira que aparece **apenas**: nome, curso, carga horária, datas,
   emissor e situação. **Não deve aparecer** e-mail, telefone nem identificador interno.

### Roteiro 7 — Certificado revogado · ~2 min

1. Entre como **`revogado@romalearn.local`**.
2. Vá em **Certificados** → o certificado aparece marcado como **Revogado**, sem botão de
   download.
3. Copie o código e acesse `http://localhost:4200/certificados/verificar/<CÓDIGO>`
   → a página informa a revogação e o motivo.

### Roteiro 8 — Compra da trilha e pagamento · ~8 min

Entre como **`pendente@romalearn.local`** (já tem um pedido aguardando pagamento).

1. Vá em **Compras** → o pedido aparece como _Aguardando pagamento_.
2. Tente acessar um módulo pago (http://localhost:4200/cursos/microsoft-word-para-administracao)
   → o botão leva à compra, **não** ao conteúdo.
3. Descubra o identificador do pagamento:
   ```bash
   docker exec -it romalearn-postgres psql -U romalearn -d romalearn -t -A -c \
     "SELECT p.\"gatewayPaymentId\", p.\"amountCents\" FROM payments p
        JOIN orders o ON o.id = p.\"orderId\"
        JOIN users u ON u.id = o.\"userId\"
       WHERE u.email = 'pendente@romalearn.local';"
   ```
4. **Teste o valor divergente** (deve recusar):
   ```bash
   ./infra/scripts/pagamento-simulado.sh aprovar <paymentId> 1
   ```
   Resposta esperada: `{"status":"amount_mismatch"}` — e o acesso **não** é liberado.
5. **Aprove com o valor correto**:
   ```bash
   ./infra/scripts/pagamento-simulado.sh aprovar <paymentId> 19700
   ```
   Resposta esperada: `{"status":"processed"}`.
6. Recarregue a área do aluno → **os 5 módulos da trilha apareceram**.
7. Confira o e-mail de pagamento aprovado no Mailpit.
8. **Teste a idempotência**: rode o mesmo comando do passo 5 de novo.
   Resposta: `{"status":"duplicate"}` — e nada é duplicado.

#### Fazendo uma compra do zero

1. Entre com uma conta sem a trilha (ex.: a que você criou no Roteiro 2).
2. Acesse http://localhost:4200/trilhas/trilha-completa-competencias-digitais
3. Clique em **Comprar a trilha** → o checkout mostra o valor com aviso de
   **ambiente de demonstração**.
4. Escolha **Pix** e clique em **Continuar para o pagamento**.
5. A tela mostra um código Pix que contém a palavra `SIMULACAO` (não é um Pix válido).
6. Copie o `paymentId` que aparece na tela e aprove com o script.

#### Testando o cupom

Entre como **admin** e crie um cupom em **/admin/produtos**: código `TESTE20`, percentual, 20.
No checkout, digite `TESTE20` e clique em **Aplicar** → o total cai 20%.

### Roteiro 9 — Bloqueios e permissões · ~5 min

| Teste                  | Como fazer                                                       | Esperado                                           |
| ---------------------- | ---------------------------------------------------------------- | -------------------------------------------------- |
| Conta suspensa         | Entrar como `suspenso@romalearn.local`                           | _"Esta conta está bloqueada. Fale com o suporte."_ |
| Aluno no painel        | Entrar como `matriculado@` e acessar `/admin`                    | Redireciona para a área do aluno                   |
| Aluno na API do painel | `curl` em `/api/admin/dashboard` com o token do aluno            | HTTP 403                                           |
| Gestor de conteúdo     | Entrar como `conteudo@` → `/admin`                               | Vê cursos; ao tentar criar produto, recebe recusa  |
| Certificado alheio     | Entrar como `matriculado@` e abrir a URL do PDF de `concluinte@` | HTTP 403                                           |

Teste direto na API (sem passar pela interface):

```bash
# Entra e guarda o token
TOKEN=$(curl -s -X POST http://localhost:3333/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"matriculado@romalearn.local","password":"Senha@123456"}' \
  | python3 -c "import sys,json;print(json.load(sys.stdin)['accessToken'])")

# Painel administrativo deve recusar
curl -s -o /dev/null -w "%{http_code}\n" \
  -H "Authorization: Bearer $TOKEN" http://localhost:3333/api/admin/dashboard   # 403

# Curso pago deve recusar
curl -s -o /dev/null -w "%{http_code}\n" \
  -H "Authorization: Bearer $TOKEN" \
  http://localhost:3333/api/learning/courses/microsoft-word-para-administracao/player   # 403
```

### Roteiro 10 — Painel administrativo · ~10 min

Entre como **`admin@romalearn.local`** / `Admin@123456` e acesse http://localhost:4200/admin

#### Visão geral

Confira os números: alunos, matrículas, cursos, receita, certificados e webhooks com falha.

#### Cursos

1. **Novo curso** → crie _Curso de Teste_, descrição curta, 4 horas.
2. Tente **Publicar** → deve recusar: um curso sem aulas não vai ao ar.
3. Abra o curso → **Adicionar parte** → _Parte 1 — Introdução_.
4. Adicione uma aula do tipo **Leitura**, 10 minutos.
5. Adicione outra aula e use as setas ↑ ↓ para reordenar.
6. **Publicar** → agora funciona.
7. Confira em http://localhost:4200/cursos → o curso novo aparece.
8. **Despublicar** → some do catálogo.

#### Produtos, ofertas e cupons

Confira que a oferta da trilha está marcada como **Teste (sandbox)** e que os produtos de cursos
avulsos estão em **rascunho** (sem preço comercial aprovado).

#### Pedidos e webhooks

Veja os pedidos criados e a lista de eventos recebidos. Um pedido aprovado pode ser
**Reembolsado** — exige motivo, revoga o acesso e registra na auditoria.

#### Usuários e liberação manual

1. Busque `novo@romalearn.local`.
2. **Liberar acesso** → escolha _Microsoft Word para Administração_, motivo _"cortesia de teste"_.
3. Saia, entre como `novo@` → o curso aparece na área do aluno.

#### Certificados

Consulte, reemita (mesmo código, novo PDF) ou revogue com justificativa.

#### Auditoria

Em **/admin/auditoria**, confira que todas as ações acima ficaram registradas com autor, data e
detalhes. Clique em **Ver detalhes** em um registro.

#### Configurações

Altere o nome da plataforma para _RomaLearn Teste_, salve e recarregue o site — o nome muda no
cabeçalho e no rodapé. Depois volte para _RomaLearn_.

### Roteiro 11 — Acessibilidade e responsividade · ~5 min

1. **Navegação por teclado**: na landing page, pressione `Tab` repetidamente.
   - o primeiro `Tab` revela **Pular para o conteúdo**;
   - todo elemento focado mostra um contorno visível;
   - é possível abrir as perguntas frequentes com `Enter`.
2. **Celular**: abra as ferramentas do navegador (F12) → modo dispositivo → iPhone SE (375px).
   - a landing page não deve rolar na horizontal;
   - o menu vira ☰;
   - as tabelas rolam sozinhas dentro do próprio bloco.
3. **Tema escuro**: mude o sistema para o modo escuro e recarregue → a interface acompanha.
4. **Zoom**: aumente para 200% → o conteúdo continua legível, sem sobreposição.

---

## Parte 5 — Problemas comuns

| Sintoma                                | Causa provável               | Solução                                              |
| -------------------------------------- | ---------------------------- | ---------------------------------------------------- |
| `ECONNREFUSED` na porta 5432           | PostgreSQL não subiu         | `pnpm infra:up` e confira com `docker ps`            |
| `pnpm: command not found`              | Corepack desativado          | `corepack enable`                                    |
| Catálogo vazio no site                 | Seed não rodou               | `pnpm seed:all`                                      |
| `Catálogo vazio` ao rodar `seed:demo`  | Faltou o `pnpm seed` antes   | `pnpm seed && pnpm seed:demo`                        |
| Erro de tipo em `@romalearn/contracts` | Contratos não compilados     | `pnpm --filter @romalearn/contracts build`           |
| E-mails não aparecem                   | Driver errado                | Confirme `MAIL_DRIVER=smtp` e a porta 1025 no `.env` |
| Porta 4200 ou 3333 ocupada             | Outro processo               | Mude `API_PORT` no `.env` ou encerre o processo      |
| Webhook responde `unknown_payment`     | `paymentId` errado           | Copie exatamente da tela ou do banco                 |
| Login falha depois do Roteiro 3        | A senha foi trocada no teste | Use a senha nova ou resete o ambiente                |

Um caso merece explicação à parte:

**"O servidor respondeu em um formato inesperado" na tela de login, com status 200 no
Network.** O front chama `/api/...` na mesma origem, e o `ng serve` repassa essas chamadas para a
API através de `apps/web/proxy.conf.json`. Se a API não estiver no ar, o dev server responde com o
próprio HTML do site (status 200, conteúdo `<!DOCTYPE html>`) e o login não chega a acontecer.
Confirme que `pnpm dev` subiu os dois processos e que `curl http://localhost:3333/api/health/ready`
responde. Se você subiu só o front, suba a API também.

**Linhas `401 SESSION_EXPIRED` em `/api/auth/me` no log da API.** São normais: o site pergunta
"existe sessão?" a cada carregamento de página, e a resposta para quem não está logado é 401. Não
indicam falha de login.

Ver os logs:

```bash
docker logs romalearn-postgres --tail 50
docker logs romalearn-mailpit --tail 50
```

---

## Parte 6 — Resetar o ambiente

Para voltar ao estado inicial, com todas as contas de teste recriadas:

```bash
pnpm infra:reset    # apaga os contêineres E os volumes (perde tudo)
pnpm infra:up
pnpm seed:all
```

Para apagar só os dados, mantendo os contêineres:

```bash
docker exec -it romalearn-postgres psql -U romalearn -d romalearn \
  -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
pnpm seed:all
```

---

## Parte 7 — Rodar a suíte automatizada

Além dos testes manuais, vale rodar a suíte para confirmar que nada quebrou:

```bash
pnpm lint          # lint da API e do front-end
pnpm test          # 35 testes unitários
pnpm test:e2e      # 64 testes end-to-end (usa o banco romalearn_test)
pnpm build         # build completo
```

O `test:e2e` cobre, entre outros, o fluxo completo
_cadastro → matrícula → aulas → questionário → conclusão → certificado → validação pública_.

Detalhes em [`testing.md`](testing.md).

---

## Resumo dos comandos

```bash
# Primeira vez
pnpm install
cp .env.example .env
pnpm infra:up
pnpm --filter @romalearn/contracts build
pnpm seed:all
pnpm dev

# Dia a dia
pnpm dev                    # sobe API + site
pnpm seed:demo              # reimprime as contas de teste
pnpm test && pnpm test:e2e  # suíte automatizada

# Pagamento simulado
./infra/scripts/pagamento-simulado.sh aprovar <paymentId> <centavos>
./infra/scripts/pagamento-simulado.sh recusar <paymentId>

# Recomeçar do zero
pnpm infra:reset && pnpm infra:up && pnpm seed:all
```
