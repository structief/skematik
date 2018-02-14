FROM node:7.9.0

WORKDIR /api

COPY package.json /api
COPY . /api

# RUN npm install --quiet || cat npm-debug.log
RUN npm install

CMD ["npm", "run-script", "watch"]
