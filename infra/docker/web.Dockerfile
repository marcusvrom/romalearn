# Imagem de produção do front-end com SSR.
# Construída a partir da raiz do monorepo:
#   docker build -f infra/docker/web.Dockerfile -t romalearn-web .

FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate
WORKDIR /app

# ----- Dependências --------------------------------------------------------
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/web/package.json apps/web/
COPY apps/api/package.json apps/api/
COPY packages/contracts/package.json packages/contracts/
COPY packages/ui/package.json packages/ui/
RUN pnpm install --frozen-lockfile

# ----- Build ----------------------------------------------------------------
FROM deps AS build
COPY tsconfig.base.json ./
COPY packages packages
COPY apps/web apps/web
RUN pnpm --filter @romalearn/contracts build && pnpm --filter @romalearn/web build

# ----- Runtime --------------------------------------------------------------
FROM base AS runtime
ENV NODE_ENV=production
ENV WEB_PORT=4000

RUN addgroup -S romalearn && adduser -S romalearn -G romalearn

COPY --from=build /app/apps/web/dist ./dist

USER romalearn
EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://localhost:4000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "dist/web/server/server.mjs"]
