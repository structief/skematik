FROM node:6-slim

COPY . /public
COPY package.json /public/package.json

WORKDIR /public

ENV NODE_ENV production
RUN yarn install --production

CMD ["npm","start"]

EXPOSE 8080
