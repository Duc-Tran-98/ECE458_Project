# ECE458_Project

Repository for Duke's ECE 458 Spring 2021 Project.

# Getting Started

Before you start, make sure that you have a ".env" file in the root directory. You can download it from Teams under files.

If you don't have that file, mysql will not be able to run and the backend won't be able to connect to the DB!

To start the development containers, run the following command in the root directory (the one where docker-compose.yml lives):
docker-compose up -d --build

That will build the docker images from the Dockerfiles, then setup and run all your containers. You will want to run this command once to get started, and may want to re-run it in the event that you add new packages to the front end. See Making Changes for more.

The -d flag means to return to the terminal after the containers are up and running, and the --build flag specifies that docker should build the images needed to run the containers (an image is all your code and code dependencies wrapped up in one thing that docker can run).

Your dev containers are equipped with hot-reloading, so making any changes to your code on your machine will
automatically be copied and re-deployed to the containers.

The frontend is on port 3000 of localhost
The backend is on port 4000 of localhost
The phpmyadmin is on port 8081 of localhost
The mysql server is on port 3306 of localhost

You can change these ports in the docker-compose.yml file.

# PHP ADMIN

This container is just for viewing the database while we are making changes during development. The credentials needed to log in are:
user: root
server: mysql
password: {Enter password from .env file}

# Making changes

The backend container uses nodemon to watch for any changes to files in the ./server directory. This includes package.json, so
any additional packages you install should be automatically loaded into the docker container.

The frontend is slightly different. If you add any packages to ./client/package.json while the dev containers are running, you will have to stop and rebuild the containers to ensure that the new packages are installed and can be accessed in the frontend container. So, you will have to run:
docker-compose down && docker-compose up -d --build

# Stopping the dev containers

Assumming you want to keep your db and the credentials for it, run the following command in the root directory:
docker-compose down

If you want to remove your db and/or the credentials, run the following command in the root directory:
docker-compose down -v

# Common Errors and Fixes

If a docker container running an app crashes saying it can't find some module, it's probably because the node_modules folder wasn't
made in the container. To fix this issue just go to the appropriate directory on your host machine (the one where the file that crashed is) and run:
"npm install"
This will build the node_modules folder on your machine, which will then be copied to the container. This should resolve the issue.

If Docker says an HTTP request took too long, run "docker-compose down" from root directory, then try starting the dev containers again.

If there any other errors, you can ask Angel or try Google.

# Linting the Project
The linter we are using for this project is [ESLint](https://eslint.org/). It is already included as a dependency in both the client and server packages (separate linting configurations exist in the `.eslintrc.json` files), so a fresh `npm install` should work. Be sure to also have the [ESLint VSCode](https://eslint.org/) plugin as well and your code will be perfect (well, depends how good you are ;))!

# Credit where credit is due
Big thanks to Material UI for saving us time with the autocomplete and datagrid components!