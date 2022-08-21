FROM node:16

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm install -g nodemon

# Bundle app source
COPY . .

EXPOSE 8080
RUN npx prisma generate
CMD [ "nodemon", "src/server.js" ]