# ./Dockerfile

FROM golang:1.17-alpine 

WORKDIR /app

ENV key=value

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY *.go ./

RUN go build -o /jwt-auth

COPY .env /app

EXPOSE 8080

CMD [ "/jwt-auth" ]
