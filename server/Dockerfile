# pull official base image
FROM node:15.7.0-alpine3.12

# set working directory
WORKDIR /usr/src/app

# Install build essentials
RUN apk add --update alpine-sdk

# Install python/pip
# ENV PYTHONUNBUFFERED=1
# RUN apk add --update --no-cache python2 && ln -sf python2 /usr/bin/python
# RUN python2.7 -m ensurepip
# RUN pip2 install --no-cache --upgrade pip setuptools
#RUN npm install -g node-gyp

COPY ./ ./
RUN npm install
RUN npm install -g nodemon

CMD [ "nodemon","index.js" ]
