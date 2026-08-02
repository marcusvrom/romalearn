# 0007 — Tipografia e marca

**Situação:** aceita

## Contexto

Os títulos usavam a mesma fonte do corpo do texto, e o logotipo era a sigla
"RL" desenhada com `<text>` num SVG. A plataforma funcionava, mas não tinha
assinatura visual: qualquer página se parecia com qualquer outra da internet.

Havia também uma inconsistência antiga: `--rl-font-sans` declarava `'Inter'`
sem que a fonte fosse carregada em lugar nenhum. O navegador ignorava a
primeira opção e caía no sistema — uma promessa que nunca se cumpriu.

## Decisão

### Sora nos títulos, fonte do sistema no corpo

**Sora** (SIL Open Font License) nos títulos e no logotipo. É geométrica, larga
e confiante em peso alto, sem os maneirismos que dificultariam a leitura de
quem está começando.

O corpo do texto **continua na fonte do sistema**. Ela já está no aparelho,
aparece sem download nenhum e é a que o aluno lê o dia inteiro em todo o
resto — a mais confortável para um capítulo de vários minutos. A marca fala nos
títulos; o conteúdo não precisa de sotaque.

### A fonte é servida pelo próprio site

Os arquivos ficam em `apps/web/public/fonts`, não no Google Fonts:

1. **Privacidade.** Uma requisição a um domínio de terceiro entrega o IP de
   cada aluno a esse terceiro sem que ele tenha escolha — o tipo de coisa que a
   LGPD manda evitar quando não há necessidade.
2. **Velocidade.** O arquivo vem da conexão que já está aberta, sem nova
   resolução de DNS nem novo handshake TLS antes da primeira letra.
3. **Previsibilidade.** O site não perde a identidade porque um domínio de fora
   caiu ou foi bloqueado na rede da empresa ou da escola.

Detalhes que mantêm o custo baixo:

- Um arquivo **variável** cobre os pesos 400–800 — menor que três estáticos.
- O `unicode-range` separa os acentos menos comuns: quem lê português baixa só
  o recorte latino, **25 KB**, e nunca busca o segundo arquivo.
- `font-display: swap` mostra o texto na fonte do sistema enquanto a Sora
  carrega. Numa conexão ruim, ler com a fonte "errada" é muito melhor do que
  encarar um título invisível.
- Um `preload` no `index.html` dispara a busca antes de o CSS pedir; sem ele o
  título troca de fonte na frente do aluno.

A OFL exige que a licença acompanhe os arquivos: ela está em
`public/fonts/OFL.txt`.

### A marca é um arco romano com degraus

O arco é a porta de entrada — e o aceno ao nome. Os três degraus dentro dele,
crescendo da esquerda para a direita, são a trilha: atravessar a porta e
continuar subindo.

Restrições que definiram o desenho:

- **Só formas cheias, nenhum traço fino.** A parede tem 4 unidades num
  `viewBox` de 32 e os vãos entre os degraus têm 2 — medidas escolhidas para
  que nada se cole na aba do navegador, a 16px.
- **Duas versões.** O símbolo vazado (`logo.svg`) some contra fundos claros e
  escuros quando fica muito pequeno, então o favicon é o inverso: ladrilho
  cheio com o arco em branco, silhueta sólida em qualquer tema.
- **Componente embutido, não `<img>`.** `rl-logo` desenha o SVG no template
  para herdar `currentColor` — branco sobre o ladrilho da marca, cor do texto
  no rodapé — sem uma requisição a mais. O arquivo em `public/logo.svg`
  continua existindo para uso fora do site.

## Consequências

- Trocar a fonte dos títulos é trocar `--rl-font-display` e os dois arquivos em
  `public/fonts`. Nenhum componente cita nome de fonte.
- Toda fonte nova vendorizada precisa da licença junto, como a Sora.
- Se um dia a marca mudar, os três lugares a ajustar são `logo.component.ts`,
  `public/logo.svg` e `public/favicon.svg` — o desenho é o mesmo path nos três.
