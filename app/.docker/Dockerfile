FROM node:20
USER node

COPY --chown=node:node .env /kewi/app/.env
COPY --chown=node:node ./app /kewi/app

VOLUME /kewi
WORKDIR /kewi

RUN npm install && npm run build
