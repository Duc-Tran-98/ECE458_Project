#!/bin/sh

sudo docker-compose down -v
sudo docker-compose -f docker-compose.prod.yml up -d --build





