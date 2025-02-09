FROM node:18

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --production

COPY . .

EXPOSE 5000

# Command to start the server
CMD ["yarn", "start"]