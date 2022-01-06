FROM node:14.15
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ADD . /usr/src/app/
RUN yarn install

ENTRYPOINT ["yarn"]