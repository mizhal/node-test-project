#!/bin/bash
sudo apt-get install -y curl emacs mysql-client rsync nodejs npm supervisor nano

# Docker Service
sudo su
echo 'DOCKER_OPTS="-H=tcp://0.0.0.0:4243 ${DOCKER_OPTS}"' >> /etc/default/docker
echo 'DOCKER_OPTS="-H=unix:///var/run/docker.sock ${DOCKER_OPTS}"' >> /etc/default/docker