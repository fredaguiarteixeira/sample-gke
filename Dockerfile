FROM node:lts-alpine

WORKDIR /app
RUN set -ex && \
    adduser node root && \
    apk add --update --no-cache

COPY . .

RUN npm install

USER node
EXPOSE 3000

ENTRYPOINT ["npm"]
CMD ["run", "server"]
