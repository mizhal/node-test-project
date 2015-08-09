#!/bin/bash
sudo apt-get install -y curl emacs mysql-client rsync supervisor nano mongodb postgresql
curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -
sudo apt-get update
sudo apt-get install -y nodejs node-gyp 
sudo npm install -g bower grunt grunt-cli

# Docker Service
sudo su
echo 'DOCKER_OPTS="-H=tcp://0.0.0.0:4243 ${DOCKER_OPTS}"' >> /etc/default/docker
echo 'DOCKER_OPTS="-H=unix:///var/run/docker.sock ${DOCKER_OPTS}"' >> /etc/default/docker