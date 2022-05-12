FROM node:lts-alpine as build-stage

WORKDIR /app

COPY package*.json yarn.lock ./

COPY .env ./

COPY prisma ./prisma

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 3003

CMD ["node", "dist/src/main.js"]