# Build stage
FROM 805012293679.dkr.ecr.us-east-2.amazonaws.com/alpine-nodejs_build:latest AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install 

COPY . .
RUN npm run build
RUN apk add --no-cache python3

WORKDIR /usr/src/app/dist
CMD ["python3", "-m", "http.server", "8080"]
