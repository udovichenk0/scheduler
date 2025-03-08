FROM golang:1.24.1-alpine AS base

WORKDIR /app

COPY config ./server/config
COPY migrations ./server/migrations
RUN chmod +x ./server/migrations/entrypoint.sh
ENTRYPOINT ["sh", "/app/server/migrations/entrypoint.sh"]

RUN cd /app/server/migrations && go build -o /app/bin ./main.go


FROM golang:1.24.1-alpine AS final

WORKDIR /app

COPY --from=base /app/bin ./bin
COPY --from=base /app/server/migrations/entrypoint.sh ./

ENTRYPOINT ["sh", "/app/entrypoint.sh"]

CMD ["/app/bin"]