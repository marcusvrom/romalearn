# Cadastrando conteúdo

Todo o conteúdo é gerenciado pelo painel administrativo, **sem alterações no código**.

Acesse `/admin` com uma conta que tenha papel `ADMIN` ou `CONTENT_MANAGER`.

## Montando um curso

### 1. Criar o curso

`/admin/cursos` → **Novo curso**

Informe título, descrição curta, carga horária e nível. Marque "curso gratuito" apenas para o
módulo de entrada — cursos gratuitos permitem matrícula sem pagamento.

O curso nasce como **rascunho** e não aparece no site.

### 2. Completar as informações

Abra o curso e preencha a descrição completa (parágrafos separados por linha em branco) e a carga
horária, que é o valor impresso no certificado.

### 3. Criar as partes

Cada parte corresponde a uma "Parte" do e-book. Use o resumo para registrar os objetivos
("Ao concluir esta parte…").

### 4. Adicionar as aulas

Para cada capítulo, escolha o tipo de aula:

| Tipo              | Quando usar          | Como o aluno conclui                          |
| ----------------- | -------------------- | --------------------------------------------- |
| Leitura           | Capítulo em texto    | Permanência mínima (metade do tempo estimado) |
| Vídeo             | Videoaula            | Assistir a 90% do vídeo                       |
| PDF               | Capítulo em PDF      | Permanência mínima                            |
| Download          | Material para baixar | Confirmação explícita                         |
| Atividade prática | Exercício do e-book  | Enviar o relato da entrega                    |
| Questionário      | Avaliação            | Alcançar a nota mínima                        |

A duração estimada define a exigência de permanência nas aulas de leitura — use um valor realista.

Reordene partes e aulas com as setas ↑ ↓; a ordem é salva na hora.

### 5. Publicar

O botão **Publicar** exige pelo menos uma aula publicada. Um curso vazio nunca vai ao ar.

## Questionários

O questionário pertence a uma aula do tipo Questionário. Configure nota mínima, limite de
tentativas (vazio = ilimitadas), embaralhamento e exibição do gabarito após o envio.

Cada questão precisa de pelo menos uma alternativa correta — a API recusa salvar sem isso.

Em múltipla escolha, a resposta só conta como certa se o conjunto for exatamente o esperado: não
há acerto parcial.

Salvar o questionário substitui as questões anteriores. Tentativas já enviadas mantêm a nota e as
respostas do momento em que foram feitas.

## Materiais de apoio

Anexe o e-book oficial e planilhas modelo às aulas. O upload aceita PDF, DOCX, XLSX, PPTX, CSV e
ZIP, com limite de tamanho definido por `STORAGE_MAX_UPLOAD_BYTES`.

Materiais privados são servidos por URL assinada e temporária — o link não pode ser repassado
indefinidamente.

## Critérios de conclusão

Cada curso define o que é preciso para concluir:

- percentual mínimo de aulas concluídas;
- aprovação em todos os questionários;
- envio de todas as atividades práticas.

O padrão exige 100% das aulas, todos os questionários aprovados e todas as atividades enviadas.
O aluno vê no player exatamente o que ainda falta.

Ao cumprir os critérios, a matrícula é concluída e o certificado é emitido automaticamente — uma
única vez.

## Produtos e ofertas

Conteúdo e comércio são separados:

1. **Produto** aponta para um curso ou trilha;
2. **Oferta** define preço, moeda e condições.

Um produto sem oferta ativa não pode ser comprado. Ofertas marcadas como **sandbox** servem para
testar o fluxo e são recusadas em produção — publique uma oferta de produção só quando houver
preço comercial aprovado.

## Liberação manual de acesso

`/admin/usuarios` → **Liberar acesso**

Cria a mesma permissão de uma compra aprovada, com motivo obrigatório registrado na auditoria.
Útil para cortesias, suporte e correção de problemas de pagamento.

## Certificados

`/admin/certificados` permite consultar, reemitir (mesmo código, novo PDF) e revogar com
justificativa. A revogação aparece imediatamente na página pública de validação.

## Conteúdo inicial

O seed já cadastra a estrutura dos cinco módulos e do módulo gratuito a partir dos e-books
oficiais: partes, capítulos, atividades práticas, projeto final e questionário de conclusão.

Cada aula traz o resumo oficial do capítulo, os tópicos e o encaminhamento ao e-book — que segue
sendo a fonte completa do conteúdo. Ao anexar o PDF do e-book à aula, o aluno passa a ter tudo em
um só lugar.

O Módulo 5 (IA para Processos Administrativos) está cadastrado como rascunho e sem capítulos: o
e-book ainda não existe e o conteúdo não foi inventado. Assim que o material ficar pronto, monte
as partes e capítulos pelo painel e publique.
