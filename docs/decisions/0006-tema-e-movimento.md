# 0006 — Tema claro/escuro e movimento na interface

**Situação:** aceita

## Contexto

A plataforma tinha um único tema claro e um menu de celular que apenas
empurrava a página para baixo. A landing sustentava a informação, mas não
criava impressão de cuidado — e ela é a primeira coisa que um aluno em dúvida
vê.

Ao mesmo tempo, o público-alvo é gente que está começando: parte chega por
celulares modestos e internet limitada, e parte convive com sensibilidade a
movimento. Qualquer ganho visual que custe carregamento ou atrapalhe a leitura
trabalha contra o produto.

## Decisão

### O tema mora nos tokens, não nos componentes

Os papéis semânticos do tema escuro ficam num único mixin (`tema-escuro`) em
`tokens.scss`, aplicado nos dois caminhos que levam ao escuro: a preferência do
sistema (`prefers-color-scheme`) e a escolha explícita (`[data-theme='dark']`).
Antes os dois estavam escritos separadamente e já divergiam.

A escala de cor (`--rl-brand-700`, `--rl-danger-700`, …) **não** muda com o
tema. Ela é calibrada contra fundo claro e serve tanto de texto quanto de
fundo: clareá-la no escuro consertaria os textos e quebraria os fundos que
carregam texto branco. Em vez disso existem papéis próprios para texto sobre
superfície — `--rl-brand-link`, `--rl-success-text`, `--rl-warn-text`,
`--rl-danger-text`, `--rl-surface-sunken` —, e são eles que os componentes
usam.

### O tema é pintado antes da primeira renderização

O HTML sai do servidor sem tema: o servidor não sabe o que este aluno
escolheu. Um script embutido e síncrono no `index.html` lê a preferência do
`localStorage` e marca `data-theme` antes da primeira pintura. Sem ele, quem
prefere o escuro leva um clarão branco a cada carregamento.

A chave (`romalearn:tema`) aparece em dois lugares — no script e em
`THEME_STORAGE_KEY` — porque o script precisa rodar antes de qualquer módulo
carregar. As três opções são `claro`, `escuro` e `sistema`; em `sistema` o
atributo sai de cena e a media query assume, inclusive quando o aluno troca o
tema do aparelho com a página aberta.

O seletor é um grupo de rádio com as três opções visíveis, não um botão que
alterna em ciclo: com três estados, o ciclo obriga a adivinhar quantos toques
faltam e não anuncia o estado atual.

### Sem biblioteca 3D

A malha animada do topo da landing é canvas 2D escrito à mão. Uma biblioteca
como three.js custaria centenas de kilobytes na primeira página que o aluno
abre — justamente onde ele decide se fica. O efeito pretendido (profundidade
discreta atrás do título) não justifica esse peso.

### O movimento é sempre acréscimo, nunca condição

- A malha e as revelações não rodam no servidor nem sob
  `prefers-reduced-motion: reduce`; sobra o degradê estático, que sustenta o
  visual sozinho.
- A classe que esconde um elemento antes de revelá-lo (`rl-revelavel`) é
  aplicada **pelo navegador**, só depois que existe um observador para
  revelá-lo. Ela nunca aparece no HTML do servidor: se o JavaScript falhar, a
  página inteira continua legível.
- Sob movimento reduzido a regra global zera a duração das transições, o que
  deixaria o elemento parado em opacidade 0 — por isso há uma regra explícita
  devolvendo opacidade 1.

### A gaveta do celular prende o foco

O menu virou uma gaveta que cobre o conteúdo. Ela trava a rolagem da página
atrás, prende o Tab dentro de si, fecha com Escape devolvendo o foco ao botão
que a abriu, e fecha ao navegar — inclusive pelo botão "voltar" do navegador.
Sem a prisão de foco, o Tab passava por baixo do véu e chegava a links
invisíveis, um caminho sem volta para quem navega por teclado.

## Consequências

- Trocar a identidade visual continua sendo trocar `tokens.scss`.
- Um componente novo que precise de texto colorido sobre superfície deve usar
  os papéis semânticos, não a escala. Usar a escala funciona no claro e falha
  no escuro — é o erro que essa separação existe para evitar.
- `backdrop-filter` transforma o elemento em bloco de contenção de tudo que é
  `position: fixed` lá dentro. Foi o que prendeu a gaveta à faixa do cabeçalho
  até o desfoque ser movido para um pseudo-elemento. Vale lembrar disso antes
  de aplicar desfoque em qualquer contêiner que hospede camadas fixas.
