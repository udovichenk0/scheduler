FROM golang:1.24.1-alpine AS base

WORKDIR /app

COPY config config
COPY migrations migrations
RUN chmod +x ./migrations/entrypoint.sh
ENTRYPOINT ["sh", "/app/migrations/entrypoint.sh"]

RUN cd /app/migrations && go build -o /app/bin ./main.go

FROM base

WORKDIR /app

COPY --from=base /app/bin ./bin
COPY --from=base /app/migrations/entrypoint.sh ./

ENTRYPOINT ["sh", "/app/entrypoint.sh"]

CMD ["/app/bin"]
