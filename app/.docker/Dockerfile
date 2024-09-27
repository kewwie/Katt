FROM node:20
USER node

COPY --chown=node:node .env /katt/app/.env
COPY --chown=node:node ./app /katt/app

WORKDIR /katt/app

RUN npm install && npm run build
