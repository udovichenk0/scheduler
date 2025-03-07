FROM golang:1.22.3-alpine as base

WORKDIR /server

COPY app ./app
COPY config ./config
COPY entrypoint.sh ./

RUN chmod +x ./entrypoint.sh

RUN cd /server/app/cmd && go build -o /server/bin ./main.go

FROM golang:1.22.3-alpine as final

WORKDIR /server

COPY --from=base /server/bin ./bin
COPY --from=base /server/entrypoint.sh ./

ENTRYPOINT ["sh", "/server/entrypoint.sh"]

CMD /server/bin