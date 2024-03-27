FROM node:20
USER node

COPY --chown=node:node ./ /kewwie

WORKDIR /kewwie

RUN npm install
RUN npm run start
