FROM node:14-alpine

WORKDIR /app

COPY package*.json /app/
COPY yarn.lock /app/
COPY . .

RUN yarn cache clean
RUN yarn install

CMD ["yarn", "run", "start"]
