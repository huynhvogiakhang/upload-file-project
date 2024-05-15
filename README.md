# Project Name
Upload File Csv Project

## Getting Started

This project involves building a web application with a backend implemented using NestJS and a frontend using React. The main functionality of the application includes user authentication with a login function, uploading CSV files with required columns: postId,id,name,email,body.Read uploaded data from the pagination user's csv file. Collecting performance feedback from users regarding the file uploading process.

### Prerequisites

What things you need to install the software and how to install them:

- Node.js
- ReactJS
- NestJS
- npm
- Docker
- Docker Compose

### Installing

A step by step series of examples that tell you how to get a development environment running:

1. Clone the repository:

git clone https://github.com/huynhvogiakhang/upload-file-project

2. Navigate into the project directory:

cd project

3. Navigate into the frontend directory:

cd ./upload-file-frontent/

4. Install the frontend dependencies:

npm install

5. Start the frontend :

npm run start 

6. Navigate into the backend directory:

cd ./upload-file-backend/

7. Install the dependencies:

npm install

8. Start the backend server:

npm run start


Now, navigate to http://localhost:3000 in your browser to see the application running (frontend), http://localhost:8080 for the server-side (backend)

###  Docker Compose

This project can be run easier with Docker Compose. This will create a container for the application itself for frontend and backend and another for the database that it connects to.

Running the project with Docker Compose

1. Build the Docker images:

docker-compose build

2. Start the Docker containers:

docker-compose up


Now, the application frontend, backend and the database are running in three separate Docker containers.

To stop the Docker containers, you can use the following command:

docker-compose down

Accessing the application
The application will be accessible at http://localhost:3000 for the frontend, http://localhost:3000 for the backend , and the database will be accessible at the port you specified in your Docker Compose file.

### API

Swagger Document: [http://localhost:8080/swagger](http://localhost:8080/swagger)

[Postman Collection JSON](./Upload File Project.postman_collection.json)

### Built With
NestJS - A progressive Node.js framework for building efficient, reliable and scalable server-side applications.
ReactJS - ReactJS is a popular JavaScript library used for building user interfaces (UIs) in web applications.

### Authors
Huỳnh Võ Gia Khang






