FROM node:20
USER node

COPY --chown=node:node .env /app/bot/.env
COPY --chown=node:node ./backend /app/bot

WORKDIR /app/bot

RUN npm install && npm run build