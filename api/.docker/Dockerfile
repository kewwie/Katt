FROM node:20
USER node

COPY --chown=node:node .env /kewi/api/.env
COPY --chown=node:node ./api /kewi/api

WORKDIR /kewi/api

RUN npm install && npm run build