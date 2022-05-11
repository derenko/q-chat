FROM node:12 as builder

WORKDIR /tmp

COPY ./package*.json yarn.lock .env ./
RUN yarn install
COPY . .
RUN yarn run build

FROM node:12-slim

WORKDIR /app

COPY --from=builder /tmp/node_modules ./node_modules
COPY --from=builder /tmp/src ./src
COPY --from=builder /tmp/package.json ./package.json
COPY --from=builder /tmp/tsconfig.json ./tsconfig.json
COPY --from=builder /tmp/tsconfig.build.json ./tsconfig.build.json
COPY --from=builder /tmp/dist ./dist
COPY --from=builder /tmp/prisma ./prisma

ENTRYPOINT ["yarn", "run", "start"]
