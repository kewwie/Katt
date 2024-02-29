FROM node:20
USER node

COPY --chown=node:node .env /kewwiebot/bot/.env
COPY --chown=node:node ./bot /kewwiebot/bot

WORKDIR /kewwiebot/bot

RUN npm install && npm run build