FROM node:18-alpine

RUN mkdir -p /workplace
WORKDIR /workplace
ADD . /workplace

RUN npm install && npm run build

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
