FROM node:20
USER node

COPY --chown=node:node .env /kewi/migrate/.env
COPY --chown=node:node ./migrate /kewi/migrate

WORKDIR /kewi/migrate

RUN npm install && npm run build
