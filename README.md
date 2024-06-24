# MF-User-Management-Service

# Pre-requisites
Node and npm should be installed on your machine. If not, please install it from [here](https://nodejs.org/en/download/)

To install typescript, ts-node and nodemon globally, run the following command:
```
npm install -g typescript ts-node nodemon
```

# Steps to run the project
1. Clone the repository
2. Run `npm install` to install all the dependencies
3. Clone the .env.example file, rename it to .env and update the values as per your environment
4. Run `npm run dev` to start the server in development mode
5. To run the db run `docker-compose up postgres` in the root directory of the project