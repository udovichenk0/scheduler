FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

RUN yarn build && npm -g install http-server

FROM node:20-alpine

USER node

WORKDIR /app

USER node

COPY --from=0 --chown=node:node /app/dist ./app

CMD ["npx", "http-server", "--proxy http://localhost:4173", "./app", "-p 4173", "-d false"]
