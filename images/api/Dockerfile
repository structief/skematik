FROM node:6-slim

COPY . /api
COPY package.json /api/package.json

WORKDIR /api

ENV NODE_ENV production
RUN yarn install --production

CMD ["npm","start"]

EXPOSE 3000
