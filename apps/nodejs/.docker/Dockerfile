FROM node:16-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app/backend

# Build App
# in production we dont need dev dependencies, running `npm ci` with `NODE_ENV=production` will install only the main dependencies
COPY package*.json .
RUN npm ci

# we don't have a build stage, so just copy the files from docker context again
COPY . .

EXPOSE 8080

CMD ["npm", "start"]
