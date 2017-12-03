FROM node:7.9

COPY app.js /app/
COPY node_modules /app/node_modules

ENTRYPOINT ["node", "/app/app.js"]