# Como as pessoas se comportam diante do caos?

Apresentação de Sociologia e Filosofia em cinco slides, feita com React, TypeScript e Vite.

## Executar

```sh
npm install
npm run dev
```

Use os botões no rodapé ou as setas esquerda e direita do teclado. Fontes e créditos estão disponíveis no cabeçalho.
Em telas menores, alguns conteúdos podem ser rolados dentro do slide; os controles permanecem fixos.

## Editar o conteúdo

- Os textos e a composição dos slides estão nos componentes de `src/App.tsx`.
- Os caminhos das imagens e os quatro vídeos ficam em `src/content.ts`: `japan`, `brazil`, `film` e `worldWarZ`.
- Em `videoSources`, cole um link do YouTube ou Vimeo, ou o caminho de um arquivo `.mp4` ou `.webm`. Outros links abrem em uma nova aba. Enquanto os campos estiverem vazios, aparecem espaços reservados.
- O vídeo do Brasil usa `t=60` e `end=106` para tocar o trecho de 1:00 a 1:46 no player incorporado. Ao abrir diretamente no YouTube, confira o final do trecho manualmente.
- Para adicionar um arquivo local, coloque-o em `public/` e use seu caminho a partir da raiz, como `/videos/japao.mp4`.
- Ao trocar uma imagem, atualize também seu texto alternativo e os créditos em `src/App.tsx`.

As imagens foram geradas por IA e são ilustrativas, não registros de acontecimentos reais. A imagem do céu no slide 4 não é um pôster ou uma cena oficial do filme.
As fontes são carregadas do Google Fonts, com alternativas do sistema caso não haja conexão.

## Produção

```sh
npm run build
```

O resultado é gerado em `dist/`. O texto histórico reproduz o roteiro do grupo. A fonte do Senado confirma a cronologia, mas não estabelece a motivação individual atribuída no texto; esse ponto e a expressão “atual presidente” estão sinalizados para revisão.