FROM node:10-alpine

# Specify working directory
WORKDIR /usr/src/app

# Copy package.json AND package-lock.json
COPY package*.json ./

# Install npm dependencies
RUN npm install

EXPOSE 3000

CMD [ "npm", "run", "start" ]
