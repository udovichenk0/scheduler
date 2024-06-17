FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn
COPY . .

RUN yarn prisma generate && yarn build

FROM node:20-alpine

WORKDIR /app

USER node

COPY --from=0 --chown=node:node /app /app

CMD yarn start:dev
