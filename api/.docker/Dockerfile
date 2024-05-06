FROM node:20
USER node

COPY --chown=node:node .env /kewi/backend/.env
COPY --chown=node:node ./backend /kewi/backend

WORKDIR /kewi/backend

RUN npm install && npm run build