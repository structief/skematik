FROM node:7.9.0

RUN mkdir -p /api

COPY package.json /api
COPY . /api

WORKDIR /api

RUN npm install --quiet || cat npm-debug.log

CMD ["npm", "run-script", "watch"];
