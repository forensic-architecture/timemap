FROM mhart/alpine-node:16.4.2


LABEL authors="Lachlan Kermode <lk@forensic-architecture.org>"

# Install app dependencies
COPY package.json /www/package.json
RUN cd /www; npm install

# Copy app source
COPY . /www
WORKDIR /www
RUN npm run build

# files available to copy at /www/build
