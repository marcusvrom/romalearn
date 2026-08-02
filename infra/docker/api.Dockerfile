# Imagem de produção da API.
# Construída a partir da raiz do monorepo:
#   docker build -f infra/docker/api.Dockerfile -t romalearn-api .

FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate
WORKDIR /app

# ----- Dependências --------------------------------------------------------
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/api/package.json apps/api/
COPY packages/contracts/package.json packages/contracts/
COPY packages/ui/package.json packages/ui/
COPY apps/web/package.json apps/web/
RUN pnpm install --frozen-lockfile --filter @romalearn/api... --filter @romalearn/contracts...

# ----- Build ----------------------------------------------------------------
FROM deps AS build
COPY tsconfig.base.json ./
COPY packages/contracts packages/contracts
COPY apps/api apps/api
RUN pnpm --filter @romalearn/contracts build && pnpm --filter @romalearn/api build

# ----- Runtime --------------------------------------------------------------
FROM base AS runtime
ENV NODE_ENV=production

# Executa como usuário sem privilégios.
RUN addgroup -S romalearn && adduser -S romalearn -G romalearn

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages/contracts/dist ./packages/contracts/dist
COPY --from=build /app/packages/contracts/package.json ./packages/contracts/
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/package.json ./apps/api/
COPY --from=build /app/apps/api/node_modules ./apps/api/node_modules

USER romalearn
WORKDIR /app/apps/api
EXPOSE 3333

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://localhost:3333/api/health/ready').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "dist/main.js"]
