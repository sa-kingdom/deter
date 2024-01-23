FROM node:20-alpine as builder
RUN mkdir -p /factory
WORKDIR /factory
COPY . /factory
RUN npm install && npm run build

FROM node:20-alpine
RUN mkdir -p /workplace
WORKDIR /workplace
COPY --from=builder /factory/.output /workplace
EXPOSE 3000
CMD ["node", "server/index.mjs"]
