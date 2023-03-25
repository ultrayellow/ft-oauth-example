FROM node:19-alpine3.16
RUN apk update && apk upgrade
RUN npm i -g pnpm
COPY entry.sh /tmp/entry.sh
RUN chmod +x /tmp/entry.sh
WORKDIR /app
