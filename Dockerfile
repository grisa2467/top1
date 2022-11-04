FROM node:12-alpine
LABEL maintainer="<support@itech.md>"

# Update OS
RUN echo http://mirror.yandex.ru/mirrors/alpine/v3.12/main > /etc/apk/repositories
RUN echo http://mirror.yandex.ru/mirrors/alpine/v3.12/community >> /etc/apk/repositories
RUN apk update && apk add --no-cache make gcc g++ 

CMD [ "node", "index.js"]

# Create the working dir
RUN mkdir -p /opt/app && mkdir /cache

EXPOSE 8080
WORKDIR /opt/app

# Do not use cache when we change node dependencies in package.json
ADD package.json yarn.lock /cache/

# Copy cache contents (if any) from local machine
# ADD .npm-cache.tgz /

# # Install packages + Prepare cache file
# RUN cd /cache \
#   && npm config set cache-folder /usr/local/share/.cache/npm \
#   && npm \
#   && cd /opt/app && ln -s /cache/node_modules node_modules 

COPY . /opt/app

RUN cd /opt/app; npm install && npm run build
