FROM node:22-alpine AS build

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

WORKDIR /app

# Contracts executa o script prepare durante o pnpm install, então seus
# fontes e tsconfigs precisam existir antes da instalação.
# O UI é consumido como código-fonte e reutiliza as dependências Angular do
# frontend no prebuild, evitando uma segunda instância do compilador/roteador.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY packages/contracts ./packages/contracts
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json

RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm --filter @romalearn/contracts build \
  && pnpm --filter @romalearn/web build

FROM node:22-alpine AS runtime

ENV NODE_ENV=production
ENV WEB_PORT=4000
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN apk add --no-cache curl tini \
  && corepack enable \
  && corepack prepare pnpm@10.33.0 --activate

WORKDIR /app

COPY --from=build /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages/contracts ./packages/contracts
COPY --from=build /app/apps/web ./apps/web

WORKDIR /app/apps/web

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=5 \
  CMD curl --fail --silent http://127.0.0.1:4000/ || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/web/server/server.mjs"]
