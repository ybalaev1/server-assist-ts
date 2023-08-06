# FROM node:14-alpine
FROM --platform=linux/amd64 node:14.17.0-alpine

WORKDIR /app

COPY package*.json /app/
COPY yarn.lock /app/
COPY . .

RUN yarn cache clean
RUN yarn install

EXPOSE 27017

CMD ["docker-compose", "up"]
