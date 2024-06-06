FROM node:20
USER node

COPY --chown=node:node .env /iwek/migrate/.env
COPY --chown=node:node ./migrate /iwek/migrate

WORKDIR /iwek/migrate

RUN npm install && npm run build
