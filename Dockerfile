FROM oven/bun:1.3-alpine AS bun-base

WORKDIR /app

# Install dependencies with Bun (lockfile: bun.lock)
FROM bun-base AS deps
COPY bun.lock package.json ./
RUN bun install --frozen-lockfile

# Build the application in standalone mode with Bun
FROM bun-base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

ARG NEXT_PUBLIC_THEBACKEND_API_BASE_URL
ENV NEXT_PUBLIC_THEBACKEND_API_BASE_URL=$NEXT_PUBLIC_THEBACKEND_API_BASE_URL

ARG NEXT_PUBLIC_ENABLE_SNOW
ENV NEXT_PUBLIC_ENABLE_SNOW=$NEXT_PUBLIC_ENABLE_SNOW

ARG NEXT_PUBLIC_ENABLE_SANTA
ENV NEXT_PUBLIC_ENABLE_SANTA=$NEXT_PUBLIC_ENABLE_SANTA

ARG NEXT_PUBLIC_ENABLE_LIGHTROPE
ENV NEXT_PUBLIC_ENABLE_LIGHTROPE=$NEXT_PUBLIC_ENABLE_LIGHTROPE

ARG NEXT_PUBLIC_ENABLE_PROJECTS_SNOW
ENV NEXT_PUBLIC_ENABLE_PROJECTS_SNOW=$NEXT_PUBLIC_ENABLE_PROJECTS_SNOW
ENV BUILD_STANDALONE=true
RUN bun run build

# Runtime uses Node for the Next.js standalone server
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Blog posts (MDX) are read from disk at runtime; include the source files.
COPY --from=builder --chown=nextjs:nodejs /app/app/blog ./app/blog

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
# set hostname to localhost
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
