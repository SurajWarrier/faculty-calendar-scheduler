FROM node:15

WORKDIR ./

COPY package*.json ./

COPY . .

RUN npm ci

EXPOSE 3000

CMD ["node", "src/index.js"]