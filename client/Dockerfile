FROM node:24-slim AS builder

RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm i --frozen-lockfile
COPY . .
RUN pnpm build

FROM devforth/spa-to-http:latest AS runner
ENV GZIP=true
ENV BROTLI=true
COPY --from=builder /app/dist .
