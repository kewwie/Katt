FROM node:20
USER node

COPY --chown=node:node ./ /kewwie

VOLUME /kewwie
WORKDIR /kewwie

RUN npm install
