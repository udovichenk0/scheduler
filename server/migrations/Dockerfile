FROM golang:1.22.3-alpine as base

WORKDIR /app

COPY config ./server/config
COPY migrations ./server/migrations
RUN chmod +x ./server/migrations/entrypoint.sh
ENTRYPOINT ["sh", "/app/server/migrations/entrypoint.sh"]

RUN cd /app/server/migrations && go build -o /app/bin ./main.go


FROM golang:1.22.3-alpine as final

WORKDIR /app

COPY --from=base /app/bin ./bin
COPY --from=base /app/server/migrations/entrypoint.sh ./

ENTRYPOINT ["sh", "/app/entrypoint.sh"]

CMD /app/bin