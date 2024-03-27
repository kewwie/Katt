FROM node:20
USER node

COPY --chown=node:node ./ /kewwie

WORKDIR /kewwie

RUN npm install
CMD ["npm", "run", "start"]
