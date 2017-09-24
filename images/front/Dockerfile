FROM node:6-slim

COPY . /front
COPY package.json /front/package.json

WORKDIR /front

ENV NODE_ENV production
RUN yarn install --production

CMD ["npm","start"]

EXPOSE 8080
