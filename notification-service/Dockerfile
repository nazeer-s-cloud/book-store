FROM node:18-alpine

WORKDIR /app

# copy package files first
COPY package*.json ./

# install dependencies
RUN npm install

# copy full project
COPY . .

# build project
RUN npm run build

EXPOSE 3003

CMD ["node", "dist/main"]