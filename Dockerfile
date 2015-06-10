FROM ubuntu:14.04

USER root
RUN apt-get update
RUN apt-get install -y wget git python2.7 build-essential

# Instalar Node 0.12
RUN curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -
RUN apt-get install -y nodejs npm
RUN ln -s /usr/bin/nodejs /usr/bin/node

ENV PATH /usr/local/node/bin:$PATH

RUN useradd -ms /bin/bash appuser
RUN mkdir /var/www
RUN mkdir /var/www/app
COPY . /var/www/app
RUN rm -rf /var/www/app/node_modules
RUN chown appuser:appuser /var/www -R

USER appuser
RUN cd /var/www/app; NODE_ENV=production npm install --python=python2.7
EXPOSE 8080
CMD ["NODE_ENV=production", "PORT=8080", "node", "/var/www/app/server/app.js"]
