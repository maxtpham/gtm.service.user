FROM node:10-alpine as base
RUN apk update && \
    apk add --no-cache make python && \
    apk add --virtual  build-dependencies build-base gcc && \
    python -m ensurepip && \
    rm -r /usr/lib/python*/ensurepip && \
    pip install --upgrade pip setuptools && \
    mkdir /app && mkdir /app/config
WORKDIR /app

FROM base as core
COPY package-core.json package.json
ENV NODE_ENV=development
# node_modules for core & cleanup
RUN npm install && \
    apk del build-dependencies && \
    rm -r /root/.cache && \
    rm -rf /var/cache/apk/*
ENV PATH /app/node_modules/.bin:$PATH

FROM core as publish
COPY package.json package.json
RUN npm install
ENV NODE_ENV=production
COPY ./ .
RUN npm run build

FROM base as final
ENV NODE_ENV=production
COPY --from=publish /app/package.json .
RUN npm install --production
COPY --from=publish /app/config/production-docker.json config/production.json
COPY --from=publish /app/swagger/output/swagger.json swagger/output/swagger.json
COPY --from=publish /app/bin bin
EXPOSE 80
CMD [ "npm", "run", "start:prd" ]