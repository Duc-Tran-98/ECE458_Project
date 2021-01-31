# ECE458_Project

Repository for Duke's ECE 458 Spring 2021 Project.

# Getting Started

To start the development containers, run the following command in the root directory (the one where docker-compose.yml lives):
docker-compose up -d --build

That will build the docker images from the Dockerfiles, then setup and run all your containers

Your dev containers are equipped with hot-reloading, so making any changes to your code on your machine will
automatically be copied and re-deployed to the containers.

The frontend is on port 3000 of localhost
The backend is on port 5000 of localhost
The phpmyadmin is on port 8081 of localhost
The mysql server is on port 3306 of localhost

You can change these ports in the docker-compose.yml file.

# Stopping the dev containers

Assumming you want to keep your db and the credentials for it, run the following command in the root directory:
docker-compose down

If you want to remove your db and/or the credentials, run the following command in the root directory:
docker-compose down -v

# Common Errors and Fixes

If a docker container running an app crashes saying it can't find some module, it's probably because the node_modules folder wasn't
made on in the container. To fix this issue just go to the appropriate directory and run "npm install"; this will build the node_modules
folder on your machine, which will then be copied to the container. This will resolve the issue.

If Docker says an HTTP request took too long, run "docker-compose down" from root directory, then try starting the dev containers again.
