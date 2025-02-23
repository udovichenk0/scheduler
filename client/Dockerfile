FROM node:20-alpine

WORKDIR /app/client

COPY package.json yarn.lock ./

RUN yarn

COPY . .

RUN yarn build

FROM node:20-alpine

USER node

WORKDIR /app/client

USER node

COPY --from=0 --chown=node:node /app/client /app/client

CMD yarn preview --host
