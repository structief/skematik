FROM node:7.9.0

RUN mkdir -p /api/lib

COPY package.json /api
COPY src /api/src

WORKDIR /api

RUN npm install --quiet || cat npm-debug.log

VOLUME /api/src

CMD ["npm", "start"]
