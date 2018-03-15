FROM node:7.9.0

RUN mkdir -p /skematik/lib

COPY package.json /skematik
COPY package-lock.json /skematik

WORKDIR /skematik

RUN npm install --quiet || cat npm-debug.log

VOLUME /skematik/src

EXPOSE 4000

CMD ["npm", "start"]
