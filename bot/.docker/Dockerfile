FROM node:20
USER node

COPY --chown=node:node .env /kewwie/bot/.env
COPY --chown=node:node ./bot /kewwie/bot

WORKDIR /kewwie/bot

RUN npm install