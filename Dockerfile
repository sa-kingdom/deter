FROM node:20-alpine as builder
RUN mkdir -p /factory
WORKDIR /factory
COPY . /factory
RUN npm install
RUN npm run build

FROM node:20-alpine
RUN addgroup \
        -g 3000 \
        scarlet
RUN adduser -HD \
        -u 3000 \
        -G scarlet \
        -h /workplace \
        flandre
RUN mkdir -p /workplace
WORKDIR /workplace
COPY --from=builder \
    /factory/.output \
    /workplace
RUN chown -R \
        3000:3000 \
        /workplace
USER 3000
EXPOSE 3000
CMD ["node", "server/index.mjs"]
