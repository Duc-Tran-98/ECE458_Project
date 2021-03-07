#!/usr/env/bin bash
# First arg will be down compose (add "-v")

docker-compose down $1
docker-compose up -d --build