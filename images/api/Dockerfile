FROM node:7.9.0

WORKDIR /api

COPY package.json /api
COPY . /api

RUN npm install --quiet || cat npm-debug.log

CMD ["npm", "run-script", "watch"]
