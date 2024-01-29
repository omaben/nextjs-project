# syntax=docker/dockerfile:1

FROM node:18-alpine AS deps
ARG NPM_TOKEN
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
WORKDIR /app

COPY ["package*", "yarn.lock*", ".npmrc*", "./"]
RUN yarn install --ignore-engines

FROM node:18-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_API_URL

RUN yarn build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

EXPOSE 80
ENV PORT 80

CMD [ "node", "server.js" ]

# docker buildx build --platform linux/amd64 -t imoonregistry.azurecr.io/imoon-portal-web:latest .
# docker push imoonregistry.azurecr.io/imoon-portal-web:latest