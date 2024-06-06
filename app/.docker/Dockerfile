FROM node:20
USER node

COPY --chown=node:node .env /iwek/app/.env
COPY --chown=node:node ./app /iwek/app

WORKDIR /iwek/app

RUN npm install && npm run build
