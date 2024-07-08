# MF-User-Management-Service

Handles user registration, authentication, and profile management.

## Table of Contents

- [Pre-requisites](#pre-requisites)
- [Installation](#installation)
- [Database Initialization](#database-initialization)
- [Running the Project](#running-the-project)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [Architecture Overview](#architecture-overview)

## Pre-requisites

Node and npm should be installed on your machine. If not, please install it
from [here](https://nodejs.org/en/download/).

To install typescript, ts-node, and nodemon globally, run the following command:

```bash
npm install -g typescript ts-node nodemon
```

## Installation

1. Clone the repository.
2. Run `npm install` to install all the dependencies.
3. Clone the `.env.example` file, rename it to `.env`, and update the values as per your environment.

## Database Initialization

user table:

```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

roles table:

```sql
CREATE TABLE roles (
role_id SERIAL PRIMARY KEY,
role_name VARCHAR(255) UNIQUE NOT NULL,
description TEXT
);

INSERT INTO roles (role_name, description) VALUES ('admin', 'System administrator with full access');
INSERT INTO roles (role_name, description) VALUES ('user', 'Standard user with limited access');
```

user_roles table:

```sql
CREATE TABLE user_roles (
    user_id INT,
    role_id INT,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles (role_id) ON DELETE CASCADE
);
```

## Running the Project

1. Run npm run dev to start the server in development mode.
2. To run the db, run docker-compose up postgres in the root directory of the project.

## Testing

To run the tests, run the following command:

```bash
npm test
```

## API Documentation

To view the API documentation, visit http://localhost:3000/api-docs after starting the server.

## Architecture Overview

Here you can see the components of the program and how they get initialized
![Component](https://github.com/MingleFlix/MF-User-Management-Service/assets/20597157/8d1b6aed-e5ac-46d6-95cc-1ded919b0670)

### Technologies

Node.js with Express, JWT (JSON Web Tokens) for authentication.